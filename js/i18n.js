/* ============================================
   DAR ZAFRAN — i18n
   Multilingual system: EN · FR · AR
   Lightweight JS dictionary.
   Lang + dir set synchronously on <html>
   before DOMContentLoaded to prevent FOUC.
   ============================================ */

'use strict';

(function () {

  /* ============================================
     TRANSLATION DICTIONARY
     ============================================ */

  var DICT = {

    /* ---- ENGLISH ---- */
    en: {
      /* Navigation */
      'nav.menu':         'Menu',
      'nav.story':        'Our Story',
      'nav.gallery':      'Gallery',
      'nav.reservations': 'Reservations',
      'nav.cta':          'Reserve a Table',
      'nav.home':         'Home',

      /* Common CTAs */
      'cta.reserve':    'Reserve a Table',
      'cta.view-menu':  'Explore the Menu',
      'cta.our-story':  'Our Story',
      'cta.see-gallery':'See the Gallery',

      /* Section labels */
      'label.marrakech':    'Marrakech, Morocco',
      'label.tue-sun':      'Tue – Sun\u00a0·\u00a0Lunch & Dinner',
      'label.the-kitchen':  'The Kitchen',
      'label.the-menu':     'The Menu',
      'label.our-story':    'Our Story',
      'label.the-house':    'The House',
      'label.the-atm':      'The Experience',
      'label.reservations': 'Reservations',
      'label.the-gallery':  'The Gallery',

      /* Footer */
      'footer.tagline':        'Ancient craft. Present pleasure.<br>Marrakech, Morocco.',
      'footer.hours-title':    'Hours',
      'footer.hours-days':     'Tuesday \u2013 Sunday',
      'footer.hours-lunch':    'Lunch \u00b7 12:00 \u2013 15:00',
      'footer.hours-dinner':   'Dinner \u00b7 19:00 \u2013 23:00',
      'footer.hours-closed':   'Closed Mondays',
      'footer.visit-title':    'Visit Us',
      'footer.addr1':          '12 Derb Sidi Bouamar',
      'footer.addr2':          'Marrakech, 40000',
      'footer.addr3':          'Morocco',
      'footer.explore-title':  'Explore',
      'footer.explore-menu':   'Our Menu',
      'footer.explore-story':  'Our Story',
      'footer.explore-gallery':'Gallery',
      'footer.explore-res':    'Reservations',
      'footer.copyright':      '\u00a9 2026 Dar Zafran. All rights reserved.',
      'footer.privacy':        'Privacy Policy',
      'footer.terms':          'Terms of Use',

      /* Home — hero */
      'home.hero.tagline':  'Ancient craft. Present pleasure.',

      /* Home — manifesto */
      'home.manifesto.quote': 'We don\u2019t recreate tradition.<br>We carry it forward.',
      'home.manifesto.body':  'Dar Zafran was founded on a single belief: that Moroccan cuisine deserves the same reverence given to any great culinary tradition. Every dish is researched, refined, and served with the intention it was born with.',
      'home.manifesto.cta':   'Read Our Story',

      /* Home — dishes */
      'home.dishes.label':  'Signature Dishes',
      'home.dishes.h2':     'Crafted with Intention',
      'home.dishes.cta':    'View Full Menu',

      /* Home — story */
      'home.story.label': 'Our Story',

      /* Home — atmosphere */
      'home.atm.label': 'The Experience',
      'home.atm.quote': 'Moroccan heritage, expressed through<br>a contemporary dining experience.',
      'home.atm.attr':  'Dar Zafran\u00a0\u00b7\u00a0Marrakech Medina',

      /* Home — menu preview */
      'home.menu.label':     'The Menu',
      'home.menu.cta-full':  'View the Complete Menu',
      'home.menu.tab.starters': 'Starters',
      'home.menu.tab.tagines':  'Tagines',
      'home.menu.tab.couscous': 'Couscous',
      'home.menu.tab.desserts': 'Desserts',

      /* Home — reservation CTA */
      'home.cta.label':   'Reservations',
      'home.cta.btn':     'Reserve Online',

      /* Menu page */
      'menu.label':        'The Kitchen',
      'menu.tab.starters': 'Starters',
      'menu.tab.mains':    'Mains',
      'menu.tab.sweets':   'Sweets',
      'menu.tab.drinks':   'Drinks',
      'menu.tab.couscous': 'Couscous',
      'menu.full.season':  'A Contemporary Moroccan Menu',
      'menu.reserve.label': 'Reserve',
      'menu.reserve.cta':   'Reserve a Table',
      'menu.reserve.note':  'Open Tue \u2013 Sun \u00b7 Lunch & Dinner',

      /* Story page */
      'story.label':   'The House',
      'story.cta.btn': 'Reserve a Table',

      /* Gallery page */
      'gallery.label':   'The Gallery',
      'gallery.close':   'Close lightbox',
      'gallery.prev':    'Previous image',
      'gallery.next':    'Next image',

      /* Reservation page */
      'res.eyebrow':    'Tue \u2013 Sun\u00a0\u00b7\u00a0Lunch & Dinner',
      'res.label':      'Reservations',
      'res.hero.title': 'Reserve',
      'res.hero.sub':   'Secure your table at Dar Zafran',
      'res.subheading': 'For parties of 8 or more, please contact us directly.',
      'res.closed':     'We are closed on Mondays',
      'res.large-group':'For parties of 8 or more, we ask that you contact us directly by phone or email. Private dining of the full riad is available on selected evenings.',
      'aside.hours':    'Opening Hours',
      'aside.contact':  'Contact Us',
      'aside.location': 'Location',
      'aside.group':    'Group Bookings',
      'aside.closed':   'Closed Mondays',

      /* Wizard steps */
      'wizard.step1': 'Date',
      'wizard.step2': 'Time',
      'wizard.step3': 'Guests',
      'wizard.step4': 'Details',
      'wizard.step5': 'Review',

      /* Wizard headings */
      'wizard.step1.heading': 'When would you like to dine?',
      'wizard.step2.heading': 'Select a time',
      'wizard.step3.heading': 'How many guests?',
      'wizard.step4.heading': 'Your details',
      'wizard.step5.heading': 'Review your reservation',

      /* Wizard buttons */
      'wizard.btn.next':       'Continue',
      'wizard.btn.back':       'Back',
      'wizard.btn.submit':     'Send Reservation Request',
      'wizard.btn.submitting': 'Sending\u2026',

      /* Wizard time labels */
      'wizard.lunch':        'Lunch',
      'wizard.dinner':       'Dinner',
      'wizard.lunch.hours':  '12:00 \u2013 15:00',
      'wizard.dinner.hours': '19:00 \u2013 23:00',

      /* Wizard guest labels */
      'wizard.guests.large': '8+ guests \u2014 please call us',

      /* Wizard form fields */
      'wizard.field.name':            'Full Name',
      'wizard.field.name.ph':         'Your full name',
      'wizard.field.email':           'Email Address',
      'wizard.field.email.ph':        'your@email.com',
      'wizard.field.phone':           'Phone Number',
      'wizard.field.phone.ph':        '+000 000 000 000',
      'wizard.field.occasion':        'Occasion',
      'wizard.field.occasion.none':   'No special occasion',
      'wizard.field.occasion.anniv':  'Anniversary',
      'wizard.field.occasion.bday':   'Birthday',
      'wizard.field.occasion.biz':    'Business dinner',
      'wizard.field.occasion.prop':   'Proposal',
      'wizard.field.occasion.other':  'Other',
      'wizard.field.requests':        'Special Requests',
      'wizard.field.requests.ph':     'Dietary requirements, seating preferences, allergies\u2026',
      'wizard.field.requests.hint':   'For allergies, please also contact us directly at [EMAIL ADDRESS]',
      'wizard.field.optional':        'optional',

      /* Wizard review */
      'wizard.review.date':     'Date',
      'wizard.review.time':     'Time',
      'wizard.review.guests':   'Guests',
      'wizard.review.name':     'Name',
      'wizard.review.email':    'Email',
      'wizard.review.phone':    'Phone',
      'wizard.review.occasion': 'Occasion',
      'wizard.review.requests': 'Notes',
      'wizard.review.note':     'Please review your details before submitting your reservation request.',
      'wizard.review.edit':     'Edit',

      /* Wizard validation */
      'wizard.error.date-required':   'Please select a date.',
      'wizard.error.date-past':       'Please select a future date.',
      'wizard.error.date-monday':     'We are closed on Mondays. Please choose another day.',
      'wizard.error.time-required':   'Please select a time.',
      'wizard.error.guests-required': 'Please select the number of guests.',
      'wizard.error.name-required':   'Please enter your full name.',
      'wizard.error.email-required':  'Please enter your email address.',
      'wizard.error.email-invalid':   'Please enter a valid email address.',

      /* Confirmation */
      'confirm.heading': 'Request received.<br>We will be in touch.',
      'confirm.body1':   'Thank you for your reservation request. Our team will be in touch to confirm your booking.',
      'confirm.body2':   'For enquiries about private dining or group bookings, please contact us directly.',
      'confirm.demo':    'Demo notice \u2014 No booking data has been transmitted. To enable live reservations, connect a booking provider (OpenTable, Resy, SevenRooms) or a custom backend to this form.',
    },


    /* ---- FRENCH ---- */
    fr: {
      /* Navigation */
      'nav.menu':         'Menu',
      'nav.story':        'Notre Histoire',
      'nav.gallery':      'Galerie',
      'nav.reservations': 'R\u00e9servations',
      'nav.cta':          'R\u00e9server une Table',
      'nav.home':         'Accueil',

      /* Common CTAs */
      'cta.reserve':     'R\u00e9server une Table',
      'cta.view-menu':   'D\u00e9couvrir le Menu',
      'cta.our-story':   'Notre Histoire',
      'cta.see-gallery': 'Voir la Galerie',

      /* Section labels */
      'label.marrakech':    'Marrakech, Maroc',
      'label.tue-sun':      'Mar \u2013 Dim\u00a0\u00b7\u00a0D\u00e9jeuner & D\u00eener',
      'label.the-kitchen':  'La Cuisine',
      'label.the-menu':     'Le Menu',
      'label.our-story':    'Notre Histoire',
      'label.the-house':    'La Maison',
      'label.the-atm':      'L\u2019Exp\u00e9rience',
      'label.reservations': 'R\u00e9servations',
      'label.the-gallery':  'La Galerie',

      /* Footer */
      'footer.tagline':        'Art ancestral. Plaisir pr\u00e9sent.<br>Marrakech, Maroc.',
      'footer.hours-title':    'Horaires',
      'footer.hours-days':     'Mardi \u2013 Dimanche',
      'footer.hours-lunch':    'D\u00e9jeuner \u00b7 12:00 \u2013 15:00',
      'footer.hours-dinner':   'D\u00eener \u00b7 19:00 \u2013 23:00',
      'footer.hours-closed':   'Ferm\u00e9 le lundi',
      'footer.visit-title':    'Nous Rendre Visite',
      'footer.addr1':          '12 Derb Sidi Bouamar',
      'footer.addr2':          'Marrakech, 40000',
      'footer.addr3':          'Maroc',
      'footer.explore-title':  'Explorer',
      'footer.explore-menu':   'Notre Menu',
      'footer.explore-story':  'Notre Histoire',
      'footer.explore-gallery':'Galerie',
      'footer.explore-res':    'R\u00e9servations',
      'footer.copyright':      '\u00a9 2026 Dar Zafran. Tous droits r\u00e9serv\u00e9s.',
      'footer.privacy':        'Politique de Confidentialit\u00e9',
      'footer.terms':          'Conditions d\u2019Utilisation',

      /* Home — hero */
      'home.hero.tagline':  'Un savoir-faire ancestral. Un plaisir contemporain.',

      /* Home */
      'home.manifesto.quote': 'Nous ne recr\u00e9ons pas la tradition.<br>Nous la portons en avant.',
      'home.manifesto.body':  'Dar Zafran a \u00e9t\u00e9 fond\u00e9 sur une conviction : que la cuisine marocaine m\u00e9rite la m\u00eame v\u00e9n\u00e9ration que toute grande tradition culinaire. Chaque plat est recherch\u00e9, raffin\u00e9, et servi avec l\u2019intention qui lui a donn\u00e9 naissance.',
      'home.manifesto.cta':   'Notre Histoire',
      'home.dishes.label':    'Plats Signature',
      'home.dishes.h2':       'Pr\u00e9par\u00e9s avec Intention',
      'home.dishes.cta':      'Voir le Menu Complet',
      'home.story.label':     'Notre Histoire',
      'home.atm.label':       'L\u2019Exp\u00e9rience',
      'home.atm.quote':       'H\u00e9ritage marocain, exprim\u00e9 \u00e0 travers<br>une exp\u00e9rience culinaire contemporaine.',
      'home.atm.attr':        'Dar Zafran\u00a0\u00b7\u00a0M\u00e9dina de Marrakech',
      'home.menu.label':      'Le Menu',
      'home.menu.cta-full':   'Voir le Menu Complet',
      'home.menu.tab.starters': 'Entr\u00e9es',
      'home.menu.tab.tagines':  'Tajines',
      'home.menu.tab.couscous': 'Couscous',
      'home.menu.tab.desserts': 'Desserts',
      'home.cta.label':       'R\u00e9servations',
      'home.cta.btn':         'R\u00e9server en Ligne',

      /* Menu page */
      'menu.label':        'La Cuisine',
      'menu.tab.starters': 'Entr\u00e9es',
      'menu.tab.mains':    'Plats',
      'menu.tab.sweets':   'Desserts',
      'menu.tab.drinks':   'Boissons',
      'menu.tab.couscous': 'Couscous',
      'menu.full.season':  'Une carte marocaine contemporaine',
      'menu.reserve.label': 'R\u00e9server',
      'menu.reserve.cta':   'R\u00e9server une Table',
      'menu.reserve.note':  'Ouvert Mar \u2013 Dim \u00b7 D\u00e9jeuner & D\u00eener',

      /* Story page */
      'story.label':   'La Maison',
      'story.cta.btn': 'R\u00e9server une Table',

      /* Gallery page */
      'gallery.label': 'La Galerie',
      'gallery.close': 'Fermer',
      'gallery.prev':  'Image pr\u00e9c\u00e9dente',
      'gallery.next':  'Image suivante',

      /* Reservation page */
      'res.eyebrow':    'Mar \u2013 Dim\u00a0\u00b7\u00a0D\u00e9jeuner & D\u00eener',
      'res.label':      'R\u00e9servations',
      'res.hero.title': 'R\u00e9server',
      'res.hero.sub':   'R\u00e9servez votre table chez Dar Zafran',
      'res.subheading': 'Pour les groupes de 8 personnes ou plus, veuillez nous contacter directement.',
      'res.closed':     'Nous sommes ferm\u00e9s le lundi',
      'res.large-group':'Pour les groupes de 8 personnes ou plus, nous vous demandons de nous contacter directement. La privatisation du riad est disponible certains soirs.',
      'aside.hours':    'Horaires d\u2019Ouverture',
      'aside.contact':  'Nous Contacter',
      'aside.location': 'Adresse',
      'aside.group':    'R\u00e9servations de Groupe',
      'aside.closed':   'Ferm\u00e9 le lundi',

      /* Wizard steps */
      'wizard.step1': 'Date',
      'wizard.step2': 'Heure',
      'wizard.step3': 'Couverts',
      'wizard.step4': 'D\u00e9tails',
      'wizard.step5': 'R\u00e9sum\u00e9',

      /* Wizard headings */
      'wizard.step1.heading': 'Quand souhaitez-vous d\u00eener\u00a0?',
      'wizard.step2.heading': 'Choisissez un horaire',
      'wizard.step3.heading': 'Combien de couverts\u00a0?',
      'wizard.step4.heading': 'Vos coordonn\u00e9es',
      'wizard.step5.heading': 'R\u00e9capitulatif de votre r\u00e9servation',

      /* Wizard buttons */
      'wizard.btn.next':       'Continuer',
      'wizard.btn.back':       'Retour',
      'wizard.btn.submit':     'Envoyer la Demande de R\u00e9servation',
      'wizard.btn.submitting': 'Envoi en cours\u2026',

      /* Wizard time labels */
      'wizard.lunch':        'D\u00e9jeuner',
      'wizard.dinner':       'D\u00eener',
      'wizard.lunch.hours':  '12:00 \u2013 15:00',
      'wizard.dinner.hours': '19:00 \u2013 23:00',

      /* Wizard guest labels */
      'wizard.guests.large': '8+ couverts \u2014 veuillez nous appeler',

      /* Wizard form fields */
      'wizard.field.name':            'Nom complet',
      'wizard.field.name.ph':         'Votre nom complet',
      'wizard.field.email':           'Adresse e-mail',
      'wizard.field.email.ph':        'votre@email.com',
      'wizard.field.phone':           'Num\u00e9ro de t\u00e9l\u00e9phone',
      'wizard.field.phone.ph':        '+000 000 000 000',
      'wizard.field.occasion':        'Occasion',
      'wizard.field.occasion.none':   'Pas d\u2019occasion particuli\u00e8re',
      'wizard.field.occasion.anniv':  'Anniversaire de mariage',
      'wizard.field.occasion.bday':   'Anniversaire',
      'wizard.field.occasion.biz':    'D\u00eener d\u2019affaires',
      'wizard.field.occasion.prop':   'Demande en mariage',
      'wizard.field.occasion.other':  'Autre',
      'wizard.field.requests':        'Demandes particuli\u00e8res',
      'wizard.field.requests.ph':     'R\u00e9gimes alimentaires, pr\u00e9f\u00e9rences de placement, allergies\u2026',
      'wizard.field.requests.hint':   'Pour les allergies, veuillez \u00e9galement nous contacter directement \u00e0 [EMAIL ADDRESS]',
      'wizard.field.optional':        'facultatif',

      /* Wizard review */
      'wizard.review.date':     'Date',
      'wizard.review.time':     'Heure',
      'wizard.review.guests':   'Couverts',
      'wizard.review.name':     'Nom',
      'wizard.review.email':    'E-mail',
      'wizard.review.phone':    'T\u00e9l\u00e9phone',
      'wizard.review.occasion': 'Occasion',
      'wizard.review.requests': 'Notes',
      'wizard.review.note':     'Veuillez v\u00e9rifier vos informations avant de soumettre votre demande.',
      'wizard.review.edit':     'Modifier',

      /* Wizard validation */
      'wizard.error.date-required':   'Veuillez s\u00e9lectionner une date.',
      'wizard.error.date-past':       'Veuillez s\u00e9lectionner une date future.',
      'wizard.error.date-monday':     'Nous sommes ferm\u00e9s le lundi. Veuillez choisir un autre jour.',
      'wizard.error.time-required':   'Veuillez s\u00e9lectionner un horaire.',
      'wizard.error.guests-required': 'Veuillez indiquer le nombre de couverts.',
      'wizard.error.name-required':   'Veuillez entrer votre nom complet.',
      'wizard.error.email-required':  'Veuillez entrer votre adresse e-mail.',
      'wizard.error.email-invalid':   'Veuillez entrer une adresse e-mail valide.',

      /* Confirmation */
      'confirm.heading': 'Demande re\u00e7ue.<br>Nous vous contacterons.',
      'confirm.body1':   'Merci pour votre demande de r\u00e9servation. Notre \u00e9quipe vous contactera pour confirmer votre table.',
      'confirm.body2':   'Pour les demandes de privatisation ou de groupes, veuillez nous contacter directement.',
      'confirm.demo':    'Avis de d\u00e9mo \u2014 Aucune donn\u00e9e de r\u00e9servation n\u2019a \u00e9t\u00e9 transmise. Pour activer les r\u00e9servations en direct, connectez un prestataire de r\u00e9servation \u00e0 ce formulaire.',
    },


    /* ---- ARABIC ---- */
    ar: {
      /* Navigation */
      'nav.menu':         '\u0627\u0644\u0642\u0627\u0626\u0645\u0629',
      'nav.story':        '\u0642\u0635\u062a\u0646\u0627',
      'nav.gallery':      '\u0645\u0639\u0631\u0636 \u0627\u0644\u0635\u0648\u0631',
      'nav.reservations': '\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a',
      'nav.cta':          '\u0627\u062d\u062c\u0632 \u0637\u0627\u0648\u0644\u0629',
      'nav.home':         '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',

      /* Common CTAs */
      'cta.reserve':     '\u0627\u062d\u062c\u0632 \u0637\u0627\u0648\u0644\u0629',
      'cta.view-menu':   '\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0642\u0627\u0626\u0645\u0629',
      'cta.our-story':   '\u0642\u0635\u062a\u0646\u0627',
      'cta.see-gallery': '\u0645\u0639\u0631\u0636 \u0627\u0644\u0635\u0648\u0631',

      /* Section labels */
      'label.marrakech':    '\u0645\u0631\u0627\u0643\u0634\u060c \u0627\u0644\u0645\u063a\u0631\u0628',
      'label.tue-sun':      '\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u2013 \u0627\u0644\u0623\u062d\u062f\u00a0\u00b7\u00a0\u063a\u062f\u0627\u0621 \u0648\u0639\u0634\u0627\u0621',
      'label.the-kitchen':  '\u0627\u0644\u0645\u0637\u0628\u062e',
      'label.the-menu':     '\u0627\u0644\u0642\u0627\u0626\u0645\u0629',
      'label.our-story':    '\u0642\u0635\u062a\u0646\u0627',
      'label.the-house':    '\u0627\u0644\u062f\u0627\u0631',
      'label.the-atm':      '\u0627\u0644\u062a\u062c\u0631\u0628\u0629',
      'label.reservations': '\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a',
      'label.the-gallery':  '\u0627\u0644\u0645\u0639\u0631\u0636',

      /* Footer */
      'footer.tagline':        '\u062d\u0631\u0641\u0629 \u0623\u0635\u064a\u0644\u0629. \u0645\u062a\u0639\u0629 \u0631\u0627\u0647\u0646\u0629.<br>\u0645\u0631\u0627\u0643\u0634\u060c \u0627\u0644\u0645\u063a\u0631\u0628.',
      'footer.hours-title':    '\u0623\u0648\u0642\u0627\u062a \u0627\u0644\u0639\u0645\u0644',
      'footer.hours-days':     '\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u2013 \u0627\u0644\u0623\u062d\u062f',
      'footer.hours-lunch':    '\u0627\u0644\u063a\u062f\u0627\u0621 \u00b7 12:00 \u2013 15:00',
      'footer.hours-dinner':   '\u0627\u0644\u0639\u0634\u0627\u0621 \u00b7 19:00 \u2013 23:00',
      'footer.hours-closed':   '\u0645\u063a\u0644\u0642 \u064a\u0648\u0645 \u0627\u0644\u0627\u062b\u0646\u064a\u0646',
      'footer.visit-title':    '\u0632\u0648\u0631\u0648\u0646\u0627',
      'footer.addr1':          '12 \u062f\u0631\u0628 \u0633\u064a\u062f\u064a \u0628\u0648\u0639\u0645\u0631',
      'footer.addr2':          '\u0645\u0631\u0627\u0643\u0634\u060c 40000',
      'footer.addr3':          '\u0627\u0644\u0645\u063a\u0631\u0628',
      'footer.explore-title':  '\u0627\u0643\u062a\u0634\u0641',
      'footer.explore-menu':   '\u0642\u0627\u0626\u0645\u062a\u0646\u0627',
      'footer.explore-story':  '\u0642\u0635\u062a\u0646\u0627',
      'footer.explore-gallery':'\u0627\u0644\u0645\u0639\u0631\u0636',
      'footer.explore-res':    '\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a',
      'footer.copyright':      '\u00a9 2026 \u062f\u0627\u0631 \u0627\u0644\u0632\u0639\u0641\u0631\u0627\u0646. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.',
      'footer.privacy':        '\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629',
      'footer.terms':          '\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645',

      /* Home — hero */
      'home.hero.tagline':  '\u062d\u0650\u0631\u0641\u0629 \u0639\u0631\u064a\u0642\u0629. \u0645\u062a\u0639\u0629 \u0645\u0639\u0627\u0635\u0631\u0629.',

      /* Home */
      'home.manifesto.quote': '\u0646\u062d\u0646 \u0644\u0627 \u0646\u0639\u064a\u062f \u062e\u0644\u0642 \u0627\u0644\u062a\u0631\u0627\u062b.<br>\u0628\u0644 \u0646\u062d\u0645\u0644\u0647 \u0625\u0644\u0649 \u0627\u0644\u0623\u0645\u0627\u0645.',
      'home.manifesto.body':  '\u062a\u0623\u0633\u0651\u0633 \u062f\u0627\u0631 \u0627\u0644\u0632\u0639\u0641\u0631\u0627\u0646 \u0639\u0644\u0649 \u0642\u0646\u0627\u0639\u0629 \u0648\u0627\u062d\u062f\u0629: \u0623\u0646 \u0627\u0644\u0645\u0637\u0628\u062e \u0627\u0644\u0645\u063a\u0631\u0628\u064a \u064a\u0633\u062a\u062d\u0642 \u0627\u0644\u062a\u0628\u062c\u064a\u0644 \u0630\u0627\u062a\u0647 \u0627\u0644\u0645\u0645\u0646\u0648\u062d \u0644\u0623\u064a \u062a\u0642\u0644\u064a\u062f \u0637\u0647\u0648\u064a \u0639\u0638\u064a\u0645.',
      'home.manifesto.cta':   '\u0627\u0642\u0631\u0623 \u0642\u0635\u062a\u0646\u0627',
      'home.dishes.label':    '\u0623\u0637\u0628\u0627\u0642 \u0645\u0645\u064a\u0632\u0629',
      'home.dishes.h2':       '\u0645\u062d\u0636\u0651\u0631\u0629 \u0628\u0639\u0646\u0627\u064a\u0629',
      'home.dishes.cta':      '\u0627\u0633\u062a\u0639\u0631\u0636 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629',
      'home.story.label':     '\u0642\u0635\u062a\u0646\u0627',
      'home.atm.label':       '\u0627\u0644\u062a\u062c\u0631\u0628\u0629',
      'home.atm.quote':       '\u0627\u0644\u062a\u0631\u0627\u062b \u0627\u0644\u0645\u063a\u0631\u0628\u064a\u060c \u0645\u0639\u0628\u0651\u0631\u0627\u064b \u0639\u0646\u0647 \u0645\u0646 \u062e\u0644\u0627\u0644<br>\u062a\u062c\u0631\u0628\u0629 \u0637\u0647\u0648\u064a\u0629 \u0645\u0639\u0627\u0635\u0631\u0629.',
      'home.atm.attr':        '\u062f\u0627\u0631 \u0627\u0644\u0632\u0639\u0641\u0631\u0627\u0646\u00a0\u00b7\u00a0\u0645\u062f\u064a\u0646\u0629 \u0645\u0631\u0627\u0643\u0634 \u0627\u0644\u0639\u062a\u064a\u0642\u0629',
      'home.menu.label':      '\u0627\u0644\u0642\u0627\u0626\u0645\u0629',
      'home.menu.cta-full':   '\u0627\u0633\u062a\u0639\u0631\u0636 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629',
      'home.menu.tab.starters': '\u0627\u0644\u0645\u0642\u0628\u0644\u0627\u062a',
      'home.menu.tab.tagines':  '\u0627\u0644\u0637\u0627\u062c\u064a\u0646',
      'home.menu.tab.couscous': '\u0627\u0644\u0643\u0633\u0643\u0633',
      'home.menu.tab.desserts': '\u0627\u0644\u062d\u0644\u0648\u064a\u0627\u062a',
      'home.cta.label':       '\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a',
      'home.cta.btn':         '\u0627\u062d\u062c\u0632 \u0639\u0628\u0631 \u0627\u0644\u0625\u0646\u062a\u0631\u0646\u062a',

      /* Menu page */
      'menu.label':        '\u0627\u0644\u0645\u0637\u0628\u062e',
      'menu.tab.starters': '\u0627\u0644\u0645\u0642\u0628\u0644\u0627\u062a',
      'menu.tab.mains':    '\u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
      'menu.tab.sweets':   '\u0627\u0644\u062d\u0644\u0648\u064a\u0627\u062a',
      'menu.tab.drinks':   '\u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062a',
      'menu.tab.couscous': '\u0643\u0633\u0643\u0633',
      'menu.full.season':  '\u0642\u0627\u0626\u0645\u0629 \u0645\u063a\u0631\u0628\u064a\u0629 \u0645\u0639\u0627\u0635\u0631\u0629',
      'menu.reserve.label': '\u0627\u0644\u062d\u062c\u0632',
      'menu.reserve.cta':   '\u0627\u062d\u062c\u0632 \u0637\u0627\u0648\u0644\u0629',
      'menu.reserve.note':  '\u0645\u0641\u062a\u0648\u062d \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u2013 \u0627\u0644\u0623\u062d\u062f \u00b7 \u063a\u062f\u0627\u0621 \u0648\u0639\u0634\u0627\u0621',

      /* Story page */
      'story.label':   '\u0627\u0644\u062f\u0627\u0631',
      'story.cta.btn': '\u0627\u062d\u062c\u0632 \u0637\u0627\u0648\u0644\u0629',

      /* Gallery page */
      'gallery.label': '\u0627\u0644\u0645\u0639\u0631\u0636',
      'gallery.close': '\u0625\u063a\u0644\u0627\u0642',
      'gallery.prev':  '\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629',
      'gallery.next':  '\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629',

      /* Reservation page */
      'res.eyebrow':    '\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u2013 \u0627\u0644\u0623\u062d\u062f\u00a0\u00b7\u00a0\u063a\u062f\u0627\u0621 \u0648\u0639\u0634\u0627\u0621',
      'res.label':      '\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a',
      'res.hero.title': '\u0627\u062d\u062c\u0632 \u0637\u0627\u0648\u0644\u062a\u0643',
      'res.hero.sub':   '\u0627\u062d\u062c\u0632 \u0637\u0627\u0648\u0644\u062a\u0643 \u0641\u064a \u062f\u0627\u0631 \u0632\u0639\u0641\u0631\u0627\u0646',
      'res.subheading': '\u0644\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a \u0627\u0644\u0645\u0624\u0644\u0641\u0629 \u0645\u0646 8 \u0623\u0634\u062e\u0627\u0635 \u0623\u0648 \u0623\u0643\u062b\u0631\u060c \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629.',
      'res.closed':     '\u0646\u062d\u0646 \u0645\u063a\u0644\u0642\u0648\u0646 \u064a\u0648\u0645 \u0627\u0644\u0627\u062b\u0646\u064a\u0646',
      'res.large-group':'\u0644\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a \u0645\u0646 8 \u0623\u0634\u062e\u0627\u0635 \u0623\u0648 \u0623\u0643\u062b\u0631\u060c \u0646\u0637\u0644\u0628 \u0645\u0646\u0643\u0645 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0628\u0631 \u0627\u0644\u0647\u0627\u062a\u0641 \u0623\u0648 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a.',
      'aside.hours':    '\u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644',
      'aside.contact':  '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627',
      'aside.location': '\u0627\u0644\u0645\u0648\u0642\u0639',
      'aside.group':    '\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a',
      'aside.closed':   '\u0645\u063a\u0644\u0642 \u064a\u0648\u0645 \u0627\u0644\u0627\u062b\u0646\u064a\u0646',

      /* Wizard steps */
      'wizard.step1': '\u0627\u0644\u062a\u0627\u0631\u064a\u062e',
      'wizard.step2': '\u0627\u0644\u0648\u0642\u062a',
      'wizard.step3': '\u0627\u0644\u0623\u0634\u062e\u0627\u0635',
      'wizard.step4': '\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',
      'wizard.step5': '\u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629',

      /* Wizard headings */
      'wizard.step1.heading': '\u0645\u062a\u0649 \u062a\u0648\u062f\u0651\u0648\u0646 \u062a\u0646\u0627\u0648\u0644 \u0627\u0644\u0637\u0639\u0627\u0645\u061f',
      'wizard.step2.heading': '\u0627\u062e\u062a\u0631 \u0648\u0642\u062a\u0627\u064b',
      'wizard.step3.heading': '\u0643\u0645 \u0639\u062f\u062f \u0627\u0644\u0623\u0634\u062e\u0627\u0635\u061f',
      'wizard.step4.heading': '\u0628\u064a\u0627\u0646\u0627\u062a\u0643\u0645',
      'wizard.step5.heading': '\u0645\u0631\u0627\u062c\u0639\u0629 \u062d\u062c\u0632\u0643\u0645',

      /* Wizard buttons */
      'wizard.btn.next':       '\u0645\u062a\u0627\u0628\u0639\u0629',
      'wizard.btn.back':       '\u0631\u062c\u0648\u0639',
      'wizard.btn.submit':     '\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062d\u062c\u0632',
      'wizard.btn.submitting': '\u062c\u0627\u0631\u064d \u0627\u0644\u0625\u0631\u0633\u0627\u0644\u2026',

      /* Wizard time labels */
      'wizard.lunch':        '\u0627\u0644\u063a\u062f\u0627\u0621',
      'wizard.dinner':       '\u0627\u0644\u0639\u0634\u0627\u0621',
      'wizard.lunch.hours':  '12:00 \u2013 15:00',
      'wizard.dinner.hours': '19:00 \u2013 23:00',

      /* Wizard guest labels */
      'wizard.guests.large': '8+ \u0623\u0634\u062e\u0627\u0635 \u2014 \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u0646\u0627',

      /* Wizard form fields */
      'wizard.field.name':            '\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644',
      'wizard.field.name.ph':         '\u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644',
      'wizard.field.email':           '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
      'wizard.field.email.ph':        'your@email.com',
      'wizard.field.phone':           '\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641',
      'wizard.field.phone.ph':        '+000 000 000 000',
      'wizard.field.occasion':        '\u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629',
      'wizard.field.occasion.none':   '\u0644\u0627 \u0645\u0646\u0627\u0633\u0628\u0629 \u062e\u0627\u0635\u0629',
      'wizard.field.occasion.anniv':  '\u0630\u0643\u0631\u0649 \u0633\u0646\u0648\u064a\u0629',
      'wizard.field.occasion.bday':   '\u0639\u064a\u062f \u0645\u064a\u0644\u0627\u062f',
      'wizard.field.occasion.biz':    '\u0639\u0634\u0627\u0621 \u0639\u0645\u0644',
      'wizard.field.occasion.prop':   '\u0637\u0644\u0628 \u0627\u0644\u0632\u0648\u0627\u062c',
      'wizard.field.occasion.other':  '\u0623\u062e\u0631\u0649',
      'wizard.field.requests':        '\u0637\u0644\u0628\u0627\u062a \u062e\u0627\u0635\u0629',
      'wizard.field.requests.ph':     '\u0645\u062a\u0637\u0644\u0628\u0627\u062a \u063a\u0630\u0627\u0626\u064a\u0629\u060c \u062a\u0641\u0636\u064a\u0644\u0627\u062a \u0627\u0644\u062c\u0644\u0648\u0633\u060c \u062d\u0633\u0627\u0633\u064a\u0629\u2026',
      'wizard.field.requests.hint':   '\u0644\u0644\u062d\u0633\u0627\u0633\u064a\u0629 \u0627\u0644\u063a\u0630\u0627\u0626\u064a\u0629\u060c \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0644\u0649 [EMAIL ADDRESS]',
      'wizard.field.optional':        '\u0627\u062e\u062a\u064a\u0627\u0631\u064a',

      /* Wizard review */
      'wizard.review.date':     '\u0627\u0644\u062a\u0627\u0631\u064a\u062e',
      'wizard.review.time':     '\u0627\u0644\u0648\u0642\u062a',
      'wizard.review.guests':   '\u0627\u0644\u0623\u0634\u062e\u0627\u0635',
      'wizard.review.name':     '\u0627\u0644\u0627\u0633\u0645',
      'wizard.review.email':    '\u0627\u0644\u0628\u0631\u064a\u062f',
      'wizard.review.phone':    '\u0627\u0644\u0647\u0627\u062a\u0641',
      'wizard.review.occasion': '\u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629',
      'wizard.review.requests': '\u0645\u0644\u0627\u062d\u0638\u0627\u062a',
      'wizard.review.note':     '\u064a\u064f\u0631\u062c\u0649 \u0645\u0631\u0627\u062c\u0639\u0629 \u0628\u064a\u0627\u0646\u0627\u062a\u0643\u0645 \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062d\u062c\u0632.',
      'wizard.review.edit':     '\u062a\u0639\u062f\u064a\u0644',

      /* Wizard validation */
      'wizard.error.date-required':   '\u064a\u064f\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u062a\u0627\u0631\u064a\u062e.',
      'wizard.error.date-past':       '\u064a\u064f\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u062a\u0627\u0631\u064a\u062e \u0645\u0633\u062a\u0642\u0628\u0644\u064a.',
      'wizard.error.date-monday':     '\u0646\u062d\u0646 \u0645\u063a\u0644\u0642\u0648\u0646 \u064a\u0648\u0645 \u0627\u0644\u0627\u062b\u0646\u064a\u0646. \u064a\u064f\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u064a\u0648\u0645 \u0622\u062e\u0631.',
      'wizard.error.time-required':   '\u064a\u064f\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u0648\u0642\u062a.',
      'wizard.error.guests-required': '\u064a\u064f\u0631\u062c\u0649 \u062a\u062d\u062f\u064a\u062f \u0639\u062f\u062f \u0627\u0644\u0623\u0634\u062e\u0627\u0635.',
      'wizard.error.name-required':   '\u064a\u064f\u0631\u062c\u0649 \u0625\u062f\u062e\u0627\u0644 \u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644.',
      'wizard.error.email-required':  '\u064a\u064f\u0631\u062c\u0649 \u0625\u062f\u062e\u0627\u0644 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a.',
      'wizard.error.email-invalid':   '\u064a\u064f\u0631\u062c\u0649 \u0625\u062f\u062e\u0627\u0644 \u0628\u0631\u064a\u062f \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0635\u062d\u064a\u062d.',

      /* Confirmation */
      'confirm.heading': '\u062a\u0645 \u0627\u0633\u062a\u0644\u0627\u0645 \u0637\u0644\u0628\u0643\u0645.<br>\u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643\u0645 \u0642\u0631\u064a\u0628\u0627\u064b.',
      'confirm.body1':   '\u0634\u0643\u0631\u0627\u064b \u0644\u0637\u0644\u0628 \u062d\u062c\u0632\u0643\u0645. \u0633\u064a\u062a\u0648\u0627\u0635\u0644 \u0641\u0631\u064a\u0642\u0646\u0627 \u0645\u0639\u0643\u0645 \u0644\u062a\u0623\u0643\u064a\u062f \u062d\u062c\u0632\u0643\u0645.',
      'confirm.body2':   '\u0644\u0644\u0627\u0633\u062a\u0641\u0633\u0627\u0631 \u0639\u0646 \u0627\u0644\u062a\u0633\u0647\u064a\u0644\u0627\u062a \u0627\u0644\u062e\u0627\u0635\u0629 \u0623\u0648 \u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a\u060c \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629.',
      'confirm.demo':    '\u0625\u0634\u0639\u0627\u0631 \u062a\u062c\u0631\u064a\u0628\u064a \u2014 \u0644\u0645 \u064a\u064f\u0631\u0633\u064e\u0644 \u0623\u064a \u0628\u064a\u0627\u0646\u0627\u062a \u062d\u062c\u0632. \u0644\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0641\u0639\u0644\u064a\u0629\u060c \u0627\u0631\u0628\u0637 \u0645\u0632\u0648\u062f \u062d\u062c\u0632 \u0628\u0647\u0630\u0627 \u0627\u0644\u0646\u0645\u0648\u0630\u062c.',
    }

  };


  /* ============================================
     CORE MODULE
     ============================================ */

  var SUPPORTED = ['en', 'fr', 'ar'];
  var STORE_KEY = 'dz-lang';
  var DEFAULT   = 'en';

  function detectLang() {
    var stored = localStorage.getItem(STORE_KEY);
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    var browser = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    if (browser === 'fr') return 'fr';
    if (browser === 'ar') return 'ar';
    return DEFAULT;
  }

  var currentLang = detectLang();

  /* ---- Set lang + dir on <html> immediately (synchronous) ---- */
  function applyDocAttrs(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  applyDocAttrs(currentLang);


  /* ---- Translation accessor ---- */
  function t(key, lang) {
    var d = DICT[lang || currentLang];
    if (d && d[key] !== undefined) return d[key];
    if (DICT.en[key] !== undefined) return DICT.en[key];
    return key;
  }


  /* ---- Apply all data-i18n attributes ---- */
  function apply(lang) {
    lang = lang || currentLang;

    /* textContent (plain text elements) */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.dataset.i18n, lang);
      el.textContent = val;
    });

    /* innerHTML (elements with embedded <br> or <em>) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var val = t(el.dataset.i18nHtml, lang);
      el.innerHTML = val;
    });

    /* placeholder */
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var val = t(el.dataset.i18nPh, lang);
      el.setAttribute('placeholder', val);
    });

    /* aria-label */
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var val = t(el.dataset.i18nAria, lang);
      el.setAttribute('aria-label', val);
    });
  }


  /* ---- Set language ---- */
  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    currentLang = lang;
    localStorage.setItem(STORE_KEY, lang);
    applyDocAttrs(lang);
    apply(lang);
    updateSwitcherUI(lang);

    /* Lenis resize — RTL may alter scroll dimensions */
    if (window.DarZafran && window.DarZafran.lenis) {
      var lenis = window.DarZafran.lenis();
      if (lenis) setTimeout(function () { lenis.resize(); }, 50);
    }
  }


  /* ---- Switcher UI ---- */
  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('is-active', active);
    });
  }

  function initSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
      });
    });
    updateSwitcherUI(currentLang);
  }


  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    apply(currentLang);
    initSwitcher();
  });


  /* ---- Export ---- */
  window.DarZafran = window.DarZafran || {};
  window.DarZafran.i18n = {
    t: t,
    setLang: setLang,
    getLang: function () { return currentLang; },
    apply: apply
  };

})();
