import { AfterViewInit, Component } from '@angular/core';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    
    // Appelle l'init après le chargement complet
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 1000);
        }

        this.initAnimations();
        this.setupMenu();
        this.setupScrollLinks();
      }, 1500);
            // Gestion de l'ouverture de la modale au clic sur un produit
      document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
         const imageEl = card.querySelector('.product-image') as HTMLElement;
          const computedStyle = window.getComputedStyle(imageEl);
         const image = computedStyle.backgroundImage || '';

          const titleEl = card.querySelector('h3') as HTMLElement;
          const descEl = card.querySelector('p') as HTMLElement;

          const title = titleEl?.textContent || '';
          const desc = descEl?.textContent || '';

          const modal = document.getElementById('product-modal')!;
          const modalContent = document.getElementById('modal-content')!;
          const modalImage = document.getElementById('modal-image') as HTMLImageElement;
          const modalTitle = document.getElementById('modal-title')!;
          const modalDesc = document.getElementById('modal-description')!;

          const match = image.match(/url\(["']?(.*?)["']?\)/);
          modalImage.src = match ? match[1] : '';

          modalTitle.textContent = title;
          modalDesc.textContent = desc;

          modal.classList.remove('hidden');

          // Animation d'ouverture
          gsap.fromTo(
            modalContent,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
          );
        });
      });

      // Gestion de la fermeture
      document.getElementById('modal-close')?.addEventListener('click', () => {
        const modal = document.getElementById('product-modal')!;
        const modalContent = document.getElementById('modal-content')!;
        gsap.to(modalContent, {
          scale: 0.9,
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in',
          onComplete: () => modal.classList.add('hidden')
        });
      });
      // Fermeture au clic en dehors de la modale
      document.getElementById('product-modal')?.addEventListener('click', (e: MouseEvent) => {
        const modalContent = document.getElementById('modal-content');
        if (!modalContent) return;

        // Si on clique en dehors de la modale (pas dans le contenu)
        if (!modalContent.contains(e.target as Node)) {
          const modal = document.getElementById('product-modal')!;
          gsap.to(modalContent, {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => modal.classList.add('hidden')
          });
        }
      });
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const data = new FormData(form);

          const response = await fetch("https://formsubmit.co/lbpvris@gmail.com", {
            method: "POST",
            body: data,
          });

          if (response.ok) {
            form.reset();
            const msg = document.getElementById('success-message');
            if (msg) {
              msg.classList.remove('hidden');
              window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
            }
          } else {
            alert("Erreur lors de l'envoi. Merci de réessayer.");
          }
        });
      }
      const alreadyJoined = localStorage.getItem('joinedTelegram');

      if (!alreadyJoined) {
        const popup = document.getElementById('telegram-popup');
        const popupContent = popup?.querySelector('div');

        if (popup && popupContent) {
          popup.classList.remove('hidden');

          setTimeout(() => {
            popupContent.classList.add('scale-100', 'opacity-100');
          }, 100); // Pour déclencher l'animation après rendu

          const btnYes = document.getElementById('popup-yes');
          const btnNo = document.getElementById('popup-no');

          btnYes?.addEventListener('click', () => {
            localStorage.setItem('joinedTelegram', 'true');
            popup.classList.add('hidden');
          });

          btnNo?.addEventListener('click', () => {
            localStorage.setItem('joinedTelegram', 'true'); // Considéré comme “vu”
            popup.classList.add('hidden');
          });
        }
      }



    });
  }

  initAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('section').forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1
      });
    });

    gsap.utils.toArray('.product-card').forEach((card: any, i: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1
      });
    });

    gsap.from('.hero h1', {
      duration: 1.5,
      opacity: 0,
      y: -50,
      ease: 'power3.out'
    });

    gsap.from('.hero p', {
      duration: 1.5,
      opacity: 0,
      y: 50,
      delay: 0.5,
      ease: 'power3.out'
    });

    gsap.from('.hero button', {
      duration: 1,
      opacity: 0,
      y: 20,
      stagger: 0.2,
      delay: 1,
      ease: 'power3.out'
    });
  }

  setupMenu(): void {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle?.addEventListener('click', () => {
      mobileMenu?.classList.remove('hidden');
    });

    closeMenu?.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  }

  setupScrollLinks(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();

        const targetId = (anchor as HTMLAnchorElement).getAttribute('href');
        const targetElement = document.querySelector(targetId!);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }

        document.getElementById('mobile-menu')?.classList.add('hidden');
      });
    });
  }
}
