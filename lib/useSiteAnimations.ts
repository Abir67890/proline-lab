"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSiteAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // clean slate on hot-reload / re-mount (React strict mode safe)
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      // ---------- header scroll state ----------
      const header = document.getElementById("site-header");
      const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 40);
      window.addEventListener("scroll", onScroll);

      // ---------- nav indicator ----------
      const navLinks = document.querySelectorAll<HTMLAnchorElement>("#nav-links a");
      const navIndicator = document.getElementById("nav-indicator");
      const setIndicator = (el: HTMLElement) => {
        if (!navIndicator) return;
        navIndicator.style.left = el.offsetLeft + "px";
        navIndicator.style.width = el.offsetWidth + "px";
      };
      navLinks.forEach((a) => a.addEventListener("mouseenter", () => setIndicator(a)));
      const navList = document.getElementById("nav-links");
      const clearIndicator = () => { if (navIndicator) navIndicator.style.width = "0"; };
      navList?.addEventListener("mouseleave", clearIndicator);

      // ---------- magnetic buttons ----------
      const magnets = document.querySelectorAll<HTMLElement>(".magnetic");
      const magnetHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];
      magnets.forEach((btn) => {
        const move = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(btn, { x: x * 0.25, y: y * 0.5, duration: 0.4, ease: "power2.out" });
        };
        const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
        magnetHandlers.push({ el: btn, move, leave });
      });

      // ---------- cursor spotlight ----------
      const spotlight = document.getElementById("spotlight");
      const onMouseMoveSpotlight = (e: MouseEvent) => {
        if (spotlight) gsap.to(spotlight, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
      };
      window.addEventListener("mousemove", onMouseMoveSpotlight);

      // ---------- mouse tracking: hover light reveal + 3D tilt ----------
      const tiltHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];
      function addTiltAndLight(selector: string, tiltIntensity: number) {
        document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
          const move = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.setProperty("--mx", x * 100 + "%");
            card.style.setProperty("--my", y * 100 + "%");
            if (tiltIntensity) {
              gsap.to(card, {
                rotateY: (x - 0.5) * tiltIntensity,
                rotateX: -(y - 0.5) * tiltIntensity,
                transformPerspective: 900,
                duration: 0.5,
                ease: "power2.out",
              });
            }
          };
          const leave = () => {
            if (tiltIntensity) gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "power3.out" });
          };
          card.addEventListener("mousemove", move);
          card.addEventListener("mouseleave", leave);
          tiltHandlers.push({ el: card, move, leave });
        });
      }
      addTiltAndLight(".value-card.tilt-target", 7);
      addTiltAndLight(".cat-banner.tilt-target", 5);
      addTiltAndLight(".hslide-col.tilt-target", 6);
      addTiltAndLight(".about-photo.tilt-target", 8);

      // ---------- layer transformation: hero brand blocks ----------
      const heroLayerBlocks = document.querySelectorAll<HTMLElement>("#layer-field .layer-block");
      heroLayerBlocks.forEach((b) => {
        const depth = parseFloat(b.dataset.depth || "0.5");
        gsap.to(b, {
          y: -320 * depth,
          rotate: 180 * depth,
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
        });
      });

      // ---------- layer transformation: floating product-spotlight badges ----------
      const spotlightLayerBlocks = document.querySelectorAll<HTMLElement>(".spotlight-layer");
      spotlightLayerBlocks.forEach((b, i) => {
        const depth = parseFloat(b.dataset.depth || "0.5");
        gsap.fromTo(
          b,
          { y: 60 * depth + 30, opacity: 0, scale: 0.85, rotate: -8 * depth },
          {
            y: -40 * depth,
            opacity: 1,
            scale: 1,
            rotate: 6 * depth,
            ease: "none",
            scrollTrigger: { trigger: "#spotlight-product", start: "top bottom", end: "bottom top", scrub: 1 },
            delay: i * 0.05,
          }
        );
      });

      // ---------- mouse tracking: all layer blocks drift with cursor ----------
      const allLayerBlocks = document.querySelectorAll<HTMLElement>(".layer-block");
      const onMouseMoveLayers = (e: MouseEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        allLayerBlocks.forEach((b) => {
          const depth = parseFloat(b.dataset.depth || "0.5");
          const isSpotlight = b.classList.contains("spotlight-layer");
          gsap.to(b, {
            x: cx * (isSpotlight ? 26 : 70) * depth,
            y: isSpotlight ? cy * 18 * depth : undefined,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };
      window.addEventListener("mousemove", onMouseMoveLayers);

      // ---------- mouse tracking + hover light reveal + 3D tilt: product spotlight ----------
      addTiltAndLight(".spotlight-visual.tilt-target", 10);

      // ---------- mouse tracking + hover light reveal + 3D tilt: gallery cards ----------
      addTiltAndLight(".gslide-col.tilt-target", 9);

      // ---------- hero video: entrance (fade + 3D scale-in) then gentle scroll parallax ----------
      const heroVideo = document.querySelector<HTMLVideoElement>(".hero-video");
      if (heroVideo) {
        gsap.set(heroVideo, { opacity: 0, scale: 1.22, rotateX: 6, transformPerspective: 1200, transformOrigin: "50% 50%" });
        gsap.to(heroVideo, { opacity: 1, scale: 1.06, rotateX: 0, duration: 1.6, ease: "power3.out", delay: 0.15 });
        gsap.to(heroVideo, {
          scale: 1.16,
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
        });
      }

      // ---------- columns slider: pinned horizontal scroll gallery (scrub) ----------
      ScrollTrigger.matchMedia({
        "(min-width: 700px)": function () {
          const gtrack = document.getElementById("gslide-track");
          const gpin = document.querySelector<HTMLElement>(".gslide-pin");
          if (!gtrack || !gpin) return;
          const getGDistance = () => gtrack.scrollWidth - window.innerWidth + 128;
          gsap.to(gtrack, {
            x: () => -getGDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: gpin,
              start: "top top",
              end: () => "+=" + getGDistance(),
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          // per-card 3D entrance once the gallery is pinned in view
          gsap.fromTo(
            ".gslide-col",
            { rotateY: 18, scale: 0.92, opacity: 0.6 },
            {
              rotateY: 0,
              scale: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: gpin, start: "top 60%" },
            }
          );
        },
      });

      // ---------- 3D scroll entrance on category banners ----------
      gsap.utils.toArray<HTMLElement>(".cat-banner").forEach((el) => {
        gsap.fromTo(
          el,
          { rotateX: 22, opacity: 0 },
          { rotateX: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }
        );
      });

      // ---------- Ken Burns zoom on category banner photos ----------
      document.querySelectorAll<HTMLElement>(".cat-banner img").forEach((img) => {
        gsap.fromTo(img, { scale: 1.25 }, { scale: 1.05, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: img, start: "top 90%" } });
      });

      // ---------- parallax photo frames ----------
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax || "0.2");
        const img = layer.querySelector("img");
        if (!img) return;
        gsap.to(img, {
          yPercent: speed * 40,
          ease: "none",
          scrollTrigger: { trigger: layer, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // ---------- scroll-triggered cascading reveals ----------
      gsap.set(".reveal:not(.product-card)", { y: 26 });
      ScrollTrigger.batch(".reveal:not(.product-card)", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }),
      });

      // ---------- 3D perspective flip-in for elements marked .reveal-3d ----------
      gsap.set(".reveal-3d", { rotateX: -35, y: 40, transformPerspective: 1000, transformOrigin: "50% 100%" });
      ScrollTrigger.batch(".reveal-3d", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { opacity: 1, rotateX: 0, y: 0, duration: 1, stagger: 0.1, ease: "power4.out" }),
      });

      // ---------- columns slider: pinned horizontal scroll (scrub) ----------
      ScrollTrigger.matchMedia({
        "(min-width: 700px)": function () {
          const track = document.getElementById("hslide-track");
          const pin = document.querySelector<HTMLElement>(".hslide-pin");
          if (!track || !pin) return;
          const getDistance = () => track.scrollWidth - window.innerWidth + 128;
          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => "+=" + getDistance(),
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      });

      // ---------- hero entrance timeline ----------
      gsap.set(".hero-headline .left", { x: -50 });
      gsap.set(".hero-headline .right", { x: 50 });
      gsap.set(".hero-ctas", { y: 14 });
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(".hero-headline .left", { opacity: 1, x: 0, duration: 1, ease: "power4.out" })
        .to(".hero-headline .right", { opacity: 1, x: 0, duration: 1, ease: "power4.out" }, "<0.1")
        .to(".hero-script", { opacity: 1, duration: 0.6 }, "<0.3")
        .to(".hero-divider", { opacity: 1, duration: 0.6 }, "<0.1")
        .to(".hero-sub", { opacity: 1, duration: 0.8 }, "<0.1")
        .to(".hero-ctas", { opacity: 1, y: 0, duration: 0.7 }, "<0.2")
        .to(".badge-clean", { opacity: 1, duration: 0.7 }, "<0.1");

      const loaderTimeout = setTimeout(() => {
        document.getElementById("loader")?.classList.add("done");
      }, 900);

      // ---------- product counters ----------
      const countIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.count || "0", 10);
            const suffix = el.dataset.suffix || "+";
            const start = performance.now();
            const dur = 1400;
            function tick(now: number) {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.innerHTML = Math.round(eased * target) + "<span>" + suffix + "</span>";
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            countIO.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => countIO.observe(c));

      // ---------- timeline progress ----------
      const tlFill = document.getElementById("tl-fill");
      const tlNodes = document.querySelectorAll<HTMLElement>(".tl-node");
      const tlSection = document.getElementById("process");
      const onScrollTimeline = () => {
        if (!tlSection || !tlFill) return;
        const rect = tlSection.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(Math.max((vh - rect.top) / (rect.height * 0.9), 0), 1);
        tlFill.style.width = progress * 100 + "%";
        const activeCount = Math.floor(progress * tlNodes.length);
        tlNodes.forEach((n, i) => n.classList.toggle("active", i < activeCount));
      };
      window.addEventListener("scroll", onScrollTimeline);

      // ---------- category deep-links ----------
      const gotoHandlers: { el: HTMLElement; fn: (e: Event) => void }[] = [];
      document.querySelectorAll<HTMLElement>("[data-goto]").forEach((el) => {
        const fn = (e: Event) => {
          e.preventDefault();
          const cat = el.dataset.goto;
          document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            const btn = Array.from(document.querySelectorAll<HTMLButtonElement>(".cat-filter-btn")).find(
              (b) => b.textContent?.toLowerCase().includes(cat || "___")
            );
            btn?.click();
          }, 500);
        };
        el.addEventListener("click", fn);
        gotoHandlers.push({ el, fn });
      });

      // reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.globalTimeline.timeScale(50);
      }

      // cleanup
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", onScrollTimeline);
        window.removeEventListener("mousemove", onMouseMoveSpotlight);
        window.removeEventListener("mousemove", onMouseMoveLayers);
        navList?.removeEventListener("mouseleave", clearIndicator);
        magnetHandlers.forEach(({ el, move, leave }) => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
        tiltHandlers.forEach(({ el, move, leave }) => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
        gotoHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
        clearTimeout(loaderTimeout);
        countIO.disconnect();
      };
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
