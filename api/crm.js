/**
 * Vercel Serverless Function to securely proxy contact form submissions to Odoo CRM.
 * Exposes a POST endpoint at /api/crm.
 */

// Helper to escape special XML characters
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Helper to extract an integer value from Odoo's XML-RPC response
function parseXmlInteger(xmlString) {
  const match = xmlString.match(/<int>(\d+)<\/int>/);
  return match ? parseInt(match[1], 10) : null;
}

// Generate XML-RPC request for authenticate
function makeAuthXml(db, user, password) {
  return `<?xml version="1.0"?>
<methodCall>
  <methodName>authenticate</methodName>
  <params>
    <param><value><string>${escapeXml(db)}</string></value></param>
    <param><value><string>${escapeXml(user)}</string></value></param>
    <param><value><string>${escapeXml(password)}</string></value></param>
    <param><value><struct/></value></param>
  </params>
</methodCall>`;
}

// Generate XML-RPC request for create in crm.lead
function makeCreateLeadXml(db, uid, password, leadData) {
  let members = '';
  for (const [key, val] of Object.entries(leadData)) {
    if (val !== undefined && val !== null) {
      members += `
                <member>
                  <name>${escapeXml(key)}</name>
                  <value><string>${escapeXml(String(val))}</string></value>
                </member>`;
    }
  }

  return `<?xml version="1.0"?>
<methodCall>
  <methodName>execute_kw</methodName>
  <params>
    <param><value><string>${escapeXml(db)}</string></value></param>
    <param><value><int>${uid}</int></value></param>
    <param><value><string>${escapeXml(password)}</string></value></param>
    <param><value><string>crm.lead</string></value></param>
    <param><value><string>create</string></value></param>
    <param>
      <value>
        <array>
          <data>
            <value>
              <struct>${members}
              </struct>
            </value>
          </data>
        </array>
      </value>
    </param>
  </params>
</methodCall>`;
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};

    // 1. Read Odoo configurations from Environment Variables
    const odooUrl = process.env.ODOO_URL;
    const odooDb = process.env.ODOO_DB;
    const odooUser = process.env.ODOO_USERNAME;
    const odooApiKey = process.env.ODOO_API_KEY;

    // Fallback/validation: If variables are not defined, return an error
    if (!odooUrl || !odooDb || !odooUser || !odooApiKey) {
      console.error('Odoo configuration missing in Environment Variables.');
      return res.status(500).json({
        error: 'Servidor no configurado para CRM. Por favor configurar variables de entorno Odoo.',
      });
    }

    const cleanOdooUrl = odooUrl.replace(/\/$/, ''); // Remove trailing slash if present
    const commonEndpoint = `${cleanOdooUrl}/xmlrpc/2/common`;
    const objectEndpoint = `${cleanOdooUrl}/xmlrpc/2/object`;

    // 2. Authenticate to Odoo to get UID
    const authXml = makeAuthXml(odooDb, odooUser, odooApiKey);
    const authResponse = await fetch(commonEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: authXml,
    });

    if (!authResponse.ok) {
      throw new Error(`Odoo auth failed with status ${authResponse.status}`);
    }

    const authResultXml = await authResponse.text();
    const uid = parseXmlInteger(authResultXml);

    if (!uid) {
      console.error('Odoo authentication returned empty or invalid UID. Response:', authResultXml);
      return res.status(401).json({ error: 'Credenciales de Odoo inválidas o autenticación fallida.' });
    }

    // 3. Compose lead fields for crm.lead model
    const leadName = `Web Contact: ${body.nombre || 'Sin Nombre'}`;
    
    // Construct rich text description
    let description = `Mensaje recibido desde el formulario web:\n\n`;
    if (body.nombre) description += `• Nombre completo: ${body.nombre}\n`;
    if (body.email) description += `• Correo electrónico: ${body.email}\n`;
    if (body.telefono) description += `• Teléfono: ${body.telefono}\n`;
    if (body.interes) description += `• Servicio de Interés: ${body.interes}\n`;
    if (body.presupuesto) description += `• Presupuesto Estimado: ${body.presupuesto}\n`;
    if (body.objetivo) description += `• Objetivo (Crédito): ${body.objetivo}\n`;
    if (body.detalles) description += `• Detalles del Proyecto: ${body.detalles}\n`;

    const leadFields = {
      name: leadName,
      contact_name: body.nombre || '',
      email_from: body.email || '',
      phone: body.telefono || '',
      description: description
    };

    // 4. Create Lead in Odoo
    const createLeadXml = makeCreateLeadXml(odooDb, uid, odooApiKey, leadFields);
    const createResponse = await fetch(objectEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: createLeadXml,
    });

    if (!createResponse.ok) {
      throw new Error(`Odoo lead creation failed with status ${createResponse.status}`);
    }

    const createResultXml = await createResponse.text();
    const leadId = parseXmlInteger(createResultXml);

    if (!leadId) {
      console.error('Failed to create lead in Odoo. Response:', createResultXml);
      return res.status(400).json({ error: 'No se pudo crear el registro en Odoo.' });
    }

    // 5. Success
    return res.status(200).json({ success: true, lead_id: leadId });
  } catch (error) {
    console.error('Error in Vercel CRM proxy function:', error);
    return res.status(500).json({ error: 'Error interno del servidor al conectar con Odoo.' });
  }
};
