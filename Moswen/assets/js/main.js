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
    /* Cursor Trail
    -------------------------------------------------------------------------*/
    var cursorTrail = () => {
        const canvas = document.getElementById("trail");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        let w = window.innerWidth,
            h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        let points = [];
        let ripples = [];

        window.addEventListener("resize", () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        });

        window.addEventListener("mousemove", (e) => {
            points.push({ x: e.clientX, y: e.clientY });
            if (points.length > 10) points.shift();
        });

        window.addEventListener("click", (e) => {
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                alpha: 1,
            });
        });

        function draw() {
            ctx.clearRect(0, 0, w, h);

            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                let last = points[points.length - 1];
                let grad = ctx.createLinearGradient(points[0].x, points[0].y, last.x, last.y);
                grad.addColorStop(0, "black");
                grad.addColorStop(1, "white");
                ctx.strokeStyle = grad;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.stroke();
            }

            ripples.forEach((r, i) => {
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${r.alpha})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                r.radius += 1;
                r.alpha -= 0.02;
            });
            ripples = ripples.filter((r) => r.alpha > 0);

            requestAnimationFrame(draw);
        }
        draw();
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
    /* Form Submit Odoo CRM Integration
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
                var val = $(this).val();
                formData[name] = val;
            });

            // Prevent double submission
            $button.prop("disabled", true).html('<span class="text-caption">ENVIANDO...</span>');

            // Send to our secure Vercel endpoint
            fetch("/api/crm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Error en el servidor");
            })
            .then(function (data) {
                alert("¡Gracias! Tu mensaje ha sido enviado con éxito y un asesor te contactará.");
                $form[0].reset();
                // Reset select current text if any
                $form.find(".nice-select .current").each(function () {
                    var placeholder = $(this).siblings(".list").find(".option.disabled").text() || "Selecciona...";
                    $(this).text(placeholder);
                });
                $form.find('input[type="hidden"]').val('');
            })
            .catch(function (error) {
                console.error("Error submitting form:", error);
                alert("Hubo un error al enviar tu mensaje. Por favor escríbenos directamente a info@moswendesigns.com.");
            })
            .finally(function () {
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

    // Dom Ready
    $(function () {
        infiniteSlide();
        updateClock();
        cursorTrail();
        goTop();
        // settingColor();
        counterOdo();
        openMbMenu();
        clickActive();
        syncNiceSelectHidden();
        initFormCrmSubmit();
        initScrollLinks();
    });
})(jQuery);
