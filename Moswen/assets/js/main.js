/**
 * Go Top
 * Infinite Slide
 * Update Clock
 * Cursor Trail
 * Counter
 * Scroll Link
 * Setting Color
 * Open Menu
 * Click Active
 */

(function ($) {
    "use strict";

    /* Go Top
    -------------------------------------------------------------------------*/
    var goTop = function () {
        var $goTop = $("#goTop");
        var $borderProgress = $(".border-progress");
        var $footer = $(".tf-footer");

        $(window).on("scroll", function () {
            var scrollTop = $(window).scrollTop();
            var docHeight = $(document).height() - $(window).height();
            var scrollPercent = (scrollTop / docHeight) * 100;
            var progressAngle = (scrollPercent / 100) * 360;

            $borderProgress.css("--progress-angle", progressAngle + "deg");

            var windowBottom = scrollTop + $(window).height();
            var hasFooter = $footer.length > 0;
            var footerOffset = hasFooter ? $footer.offset().top : Infinity;

            if (scrollTop > 100 && windowBottom < footerOffset) {
                $goTop.addClass("show");
            } else {
                $goTop.removeClass("show");
            }
        });

        $goTop.on("click", function () {
            $("html, body").animate({ scrollTop: 0 }, 100);
        });
    };
    /* Infinite Slide 
    -------------------------------------------------------------------------*/
    var infiniteSlide = function () {
        if ($(".infiniteSlide").length > 0) {
            $(".infiniteSlide").each(function () {
                var $this = $(this);
                var style = $this.data("style") || "left";
                var clone = $this.data("clone") || 2;
                var speed = $this.data("speed") || 50;
                $this.infiniteslide({
                    speed: speed,
                    direction: style,
                    clone: clone,
                    pauseonhover: false,
                });
            });
        }
    };
    /* Update Clock
    -------------------------------------------------------------------------*/
    var updateClock = () => {
        function startClocks(selector = ".clock") {
            function updateClock() {
                const now = new Date();
                const timeString = now.toLocaleTimeString("en-GB");
                document.querySelectorAll(selector).forEach((el) => {
                    el.textContent = timeString;
                });
            }
            updateClock();
            setInterval(updateClock, 1000);
        }

        startClocks(".clock");
    };
    /* Counter Odo
    -------------------------------------------------------------------------*/
    var counterOdo = () => {
        function isElementInViewport($el) {
            var top = $el.offset().top;
            var bottom = top + $el.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            return bottom > viewportTop && top < viewportBottom;
        }
        if ($(".counter-scroll").length > 0) {
            $(window).on("scroll", function () {
                $(".wg-counter").each(function () {
                    var $counter = $(this);
                    if (isElementInViewport($counter) && !$counter.hasClass("counted")) {
                        $counter.addClass("counted");
                        var targetNumber = $counter.find(".odometer").data("number");
                        setTimeout(function () {
                            $counter.find(".odometer").text(targetNumber);
                        }, 0);
                    }
                });
            });
        }
    };
    /* Setting Color
    -------------------------------------------------------------------------*/
    const settingColor = () => {
        if (!$(".settings-color").length) return;

        const COLOR_KEY = "selectedColorIndex";

        const savedIndex = localStorage.getItem(COLOR_KEY);

        if (savedIndex !== null) {
            setColor(savedIndex);
            setActiveItem(savedIndex - 1);
        }

        $(".choose-item").on("click", function () {
            const index = $(this).index();
            setColor(index + 1);
            setActiveItem(index);
            localStorage.setItem(COLOR_KEY, index + 1);
        });

        function setColor(index) {
            $("body").attr("data-color-primary", "color-primary-" + index);
        }

        function setActiveItem(index) {
            $(".choose-item").removeClass("active").eq(index).addClass("active");
        }
    };
    /* Open Menu
    -------------------------------------------------------------------------*/
    var openMbMenu = () => {
        $(".open-mb-menu").on("click", function () {
            $(".offcanvas-menu").addClass("show");
            $("body").toggleClass("overflow-hidden");
        });

        $(".close-mb-menu").on("click", function () {
            $(".offcanvas-menu").removeClass("show");
            $("body").toggleClass("overflow-hidden");
        });
    };
    /* Click Active
    -------------------------------------------------------------------------*/
    var clickActive = () => {
        $(".btn-active").on("mouseenter", function () {
            var $btn = $(this);
            if ($btn.hasClass("active")) {
            } else {
                $(".main-action-active .btn-active").removeClass("active");
                $btn.addClass("active");
            }
        });
    };
    /* Nice Select Hidden Input Sync
    -------------------------------------------------------------------------*/
    var syncNiceSelectHidden = function () {
        $(document).on('click.nice_select_sync', '.nice-select .option:not(.disabled)', function () {
            var $dropdown = $(this).closest('.nice-select');
            var $wrap = $dropdown.closest('.nc-wrap');
            var selectedValue = $(this).text().trim();
            $wrap.find('input[type="hidden"]').val(selectedValue);
        });
    };
    /* Attribution capture (UTM, click ids and referral code), kept 30 days in localStorage
    -------------------------------------------------------------------------*/
    var ATTR_KEY = "moswen_attr";
    var ATTR_TTL = 30 * 24 * 60 * 60 * 1000;
    var readAttribution = function () {
        try {
            var a = JSON.parse(localStorage.getItem(ATTR_KEY) || "null");
            if (a && a.ts && Date.now() - a.ts < ATTR_TTL) return a;
        } catch (e) {}
        return {};
    };
    var captureAttribution = function () {
        try {
            var params = new URLSearchParams(window.location.search);
            var campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
            var attr = readAttribution();
            if (!attr.ts) {
                attr = { ts: Date.now(), landing: window.location.pathname, referrer: (document.referrer || "").slice(0, 200) };
            }
            var hasCampaign = false;
            campaignKeys.forEach(function (k) {
                var v = params.get(k);
                if (v) { attr[k] = v.slice(0, 100); hasCampaign = true; }
            });
            if (hasCampaign) attr.landing = window.location.pathname;
            var ref = params.get("ref");
            if (ref) attr.ref = ref.slice(0, 40);
            localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
        } catch (e) {}
    };
    /* Preselect the service in the contact form from any [data-interes] link
    -------------------------------------------------------------------------*/
    var initServicePreselect = function () {
        $(document).on("click", "[data-interes]", function () {
            var value = $(this).attr("data-interes");
            var $select = $(".form-cta select[name='interes']").first();
            if ($select.length && value) $select.val(value);
        });
    };
    /* Form Submit — validates, sends the lead to /api/crm and goes to /gracias
    -------------------------------------------------------------------------*/
    var initFormCrmSubmit = function () {
        $(".form-cta").on("submit", function (e) {
            e.preventDefault();
            var $form = $(this);
            var $button = $form.find("button[type='submit']");
            var originalText = $button.html();

            // Gather inputs
            var formData = {};
            $form.find("input[name], textarea[name], select[name]").each(function () {
                var name = $(this).attr("name");
                if (this.type === "checkbox") {
                    formData[name] = this.checked ? $(this).val() : "";
                } else {
                    formData[name] = $(this).val();
                }
            });

            // Attribution and source
            var attr = readAttribution();
            formData.fuente = formData.fuente || window.location.pathname || "/";
            if (attr.ref) formData.referido = attr.ref;
            ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach(function (k) {
                if (attr[k]) formData[k] = attr[k];
            });
            if (attr.landing) formData.landing = attr.landing;
            if (attr.referrer) formData.referrer = attr.referrer;

            // Inline error area
            var $error = $form.find(".form-error");
            if (!$error.length) {
                $error = $('<p class="form-error text-primary mt-3 mb-0" role="alert" style="display:none;"></p>');
                $form.find(".form-action").prepend($error);
            }
            $error.hide();

            // Prevent double submission
            $button.prop("disabled", true).html('<span class="text-caption">ENVIANDO...</span>');

            fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(function (response) {
                if (response.ok) return response.json();
                return response.json().catch(function () { return {}; }).then(function (d) {
                    throw new Error(d.error || "Error en el servidor");
                });
            })
            .then(function () {
                try {
                    sessionStorage.setItem("moswen_lead", JSON.stringify({
                        nombre: formData.nombre || "",
                        email: formData.email || "",
                        telefono: formData.telefono || "",
                        interes: formData.interes || "",
                        ts: Date.now()
                    }));
                } catch (err) {}
                window.location.href = "/gracias";
            })
            .catch(function (error) {
                console.error("Error submitting form:", error);
                $error.text("No pudimos enviar tu solicitud. Revisa tus datos o escríbenos a info@moswen.app o por WhatsApp.").show();
                $button.prop("disabled", false).html(originalText);
            });
        });
    };
    /* Scroll Link (Smooth Scroll for Anchors under GSAP/ScrollSmoother)
    -------------------------------------------------------------------------*/
    var initScrollLinks = function () {
        $(document).on("click", "a[href^='#'], a[href^='/#']", function (e) {
            var href = $(this).attr("href");
            
            // If it's a link to another page (like /#contactScroll) but we are already on the homepage
            var targetId = href;
            if (href.startsWith("/#")) {
                var path = window.location.pathname;
                if (path === "/" || path === "/index.html" || path.endsWith("/index") || path === "") {
                    targetId = href.substring(1); // Extract "#contactScroll"
                } else {
                    return; // Let the browser navigate normally to the other page
                }
            }
            
            if (targetId === "#" || targetId === "") return;
            
            var $target = $(targetId);
            if ($target.length > 0) {
                e.preventDefault();
                
                // If ScrollSmoother is active, use its scrollTo method
                if (typeof ScrollSmoother !== "undefined" && ScrollSmoother.get()) {
                    ScrollSmoother.get().scrollTo($target[0], true);
                } else if (typeof gsap !== "undefined" && gsap.to) {
                    // Fallback to GSAP ScrollTo
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: targetId,
                        ease: "power2.out"
                    });
                } else {
                    // Standard jQuery animate fallback
                    $("html, body").animate({
                        scrollTop: $target.offset().top
                    }, 800);
                }
            }
        });
    };
    /* WhatsApp Floating Widget Injection
    -------------------------------------------------------------------------*/
    var injectWhatsAppWidget = function () {
        var waHtml = `
            <a href="https://wa.me/50493157191?text=Hola%20Moswen%20Designs,%20me%20gustaría%20solicitar%20información." 
               class="whatsapp-float" 
               target="_blank" 
               rel="noopener noreferrer" 
               title="Chatea con nosotros">
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
        
        var waStyle = `
            <style>
                .whatsapp-float {
                    position: fixed;
                    bottom: 40px;
                    left: 40px;
                    background-color: #25d366;
                    color: #fff;
                    border-radius: 50px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    z-index: 9999;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }
                .whatsapp-float i {
                    font-size: 32px;
                }
                .whatsapp-float:hover {
                    background-color: #128c7e;
                    transform: scale(1.1);
                    color: #fff;
                }
                .whatsapp-float::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #25d366;
                    opacity: 0.7;
                    z-index: -1;
                    animation: wa-pulse 2s infinite;
                }
                @keyframes wa-pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                }
                @media (max-width: 767px) {
                    .whatsapp-float {
                        bottom: 20px;
                        left: 20px;
                        width: 50px;
                        height: 50px;
                    }
                    .whatsapp-float i {
                        font-size: 26px;
                    }
                }
            </style>
        `;
        
        $("head").append(waStyle);
        $("body").append(waHtml);
    };

    // Dom Ready
    $(function () {
        infiniteSlide();
        updateClock();
        goTop();
        // settingColor();
        counterOdo();
        openMbMenu();
        clickActive();
        syncNiceSelectHidden();
        captureAttribution();
        initServicePreselect();
        initFormCrmSubmit();
        initScrollLinks();
        injectWhatsAppWidget();
    });
})(jQuery);
