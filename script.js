document.addEventListener("DOMContentLoaded", () => {
    const servicesCopy = [
        ["Our journey together has been filled with love, laughter, and unforgettable moments, and now we are excited to begin this new chapter as we say ''I do.'' Surrounded by the people who mean the most to us, we look forward to a day filled with joy, celebration, and cherished memories."],
        ["Every love story is unique, and ours is no exception.From the moment our paths crossed, we knew something special was unfolding. What started as a simple encounter soon blossomed into a journey filled with laughter, adventure, and countless cherished memories. Through every challenge and triumph, our love has only grown stronger, guiding us to this beautiful moment where we take the next step together."],
        ["Let’s Celebrate!The party doesn’t stop after we say “I do”!We’re ready for an evening of laughter, dancing, delicious food, and making memories that will last a lifetime.Join us as we celebrate love, friendship, and the start of our new adventure together. Your presence will make the day even more unforgettable!"],
    ];

    gsap.registerPlugin(ScrollTrigger);
    
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const stickySection = document.querySelector(".sticky");
    const stickyHeight = window.innerHeight * 3;
    const services = document.querySelectorAll(".service");
    const indicator = document.querySelector(".indicator");
    const currentCount = document.querySelector("#current-count");
    const serviceImg = document.querySelector(".service-img");
    const serviceCopy = document.querySelector(".service-copy p");
    const serviceHeight = 70;
    const imgHeight = 250;

    serviceCopy.textContent = servicesCopy[0][0]; 

    let currentSplitText = new SplitType(serviceCopy, { type: "lines" });

    const measureContainer = document.createElement("div");

    measureContainer.style.cssText = `
        position: absolute;
        visibility: hidden;
        height: auto;
        width: auto;
        white-space: nowrap;
        font-family: "PP NeueBit";
        font-size: 60px;
        font-weight: 600;
        text-transform: uppercase;
    `;

    document.body.appendChild(measureContainer);

    const serviceWidths = Array.from(services).map((service) => {
        measureContainer.textContent = service.querySelector("p").textContent;
        return measureContainer.offsetWidth - 10;
    });

    document.body.removeChild(measureContainer);

    gsap.set(indicator, {
        width: serviceWidths[0],
        xPercent: -50,
        left: "50%",
    });

    const scrollPerService = window.innerHeight;
    let currentIndex = 0;

    const animateTextChange = (index) => {
        return new Promise((resolve) => {
            gsap.to(currentSplitText.lines, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                stagger: 0.03,
                ease: "power3.inOut",
                onComplete: () => {
                    currentSplitText.revert();
                    const newText = servicesCopy[index][0]; // ✅ Fixed
                    serviceCopy.textContent = newText;

                    currentSplitText = new SplitType(serviceCopy, { type: "lines" });

                    gsap.set(currentSplitText.lines, { opacity: 0, y: 20 });

                    gsap.to(currentSplitText.lines, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.03,
                        ease: "power3.out",
                        onComplete: resolve,
                    });
                },
            });
        });
    };

    ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `${stickyHeight}px`,
        pin: true,
        onUpdate: async (self) => {
            const progress = self.progress;
            gsap.set(".progress", { scaleY: progress });

            const scrollPosition = Math.max(0, (self.scroll() || 0) - window.innerHeight); // ✅ Fixed
            const activeIndex = Math.floor(scrollPosition / scrollPerService);

            if (activeIndex >= 0 && activeIndex < services.length && currentIndex !== activeIndex) {
                currentIndex = activeIndex;

                services.forEach((service) => service.classList.remove("active"));
                services[activeIndex].classList.add("active");

                await Promise.all([
                    gsap.to(indicator, {
                        y: activeIndex * serviceHeight,
                        width: serviceWidths[activeIndex],
                        duration: 0.5,
                        ease: "power3.inOut",
                        overwrite: true,
                    }),

                    gsap.to(serviceImg, {
                        y: -(activeIndex * imgHeight),
                        duration: 0.5,
                        ease: "power3.inOut",
                        overwrite: true,
                    }),

                    gsap.to(currentCount,{
                        innerText: activeIndex + 1,
                        snap: { innerText: 1},
                        duration: 0.3,
                        ease: "power3.out",
                    }),

                    animateTextChange(activeIndex),
                ]);
            }
        },
    });
    const events = document.querySelectorAll('.event');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    events.forEach(event => {
      observer.observe(event);
    });

    function startCountdown(targetDate) {
        let deadline = new Date(targetDate).getTime();
        let x = setInterval(function () {
            let now = new Date().getTime();
            let t = deadline - now;
    
            let days = Math.floor(t / (1000 * 60 * 60 * 24));
            let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((t % (1000 * 60)) / 1000);
    
            document.getElementById(`days`).innerHTML = 
                `${days}`;
            document.getElementById(`hours`).innerHTML = 
                `${hours}`;
            document.getElementById(`minutes`).innerHTML = 
                `${minutes}`;
            document.getElementById(`seconds`).innerHTML = 
                `${seconds}`;
            if (t < 0) {
                clearInterval(x);
                document.getElementById(elementId).innerHTML = "EXPIRED";
            }
        }, 1000);
    }
    startCountdown("Jun 11, 2025 01:01:01");
});

