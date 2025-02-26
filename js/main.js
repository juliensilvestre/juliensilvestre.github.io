jQuery(document).ready(function($) {

    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Header fixed on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
    });

    if ($(window).scrollTop() > 100) {
        $('#header').addClass('header-scrolled');
    }

    // Real view height for mobile devices
    if (window.matchMedia("(max-width: 767px)").matches) {
        $('#intro').css({ height: $(window).height() });
    }

    // Initiate the wowjs animation library
    new WOW().init();

    // Initialize Venobox
    $('.venobox').venobox({
        bgcolor: '',
        overlayColor: 'rgba(6, 12, 34, 0.85)',
        closeBackground: '',
        closeColor: '#fff'
    });

    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });


    /*--/ Star Typed /--*/
    if ($('.text-slider').length == 1) {
        var typed_strings = $('.text-slider-items').text();
        var typed = new Typed('.text-slider', {
            strings: typed_strings.split(','),
            typeSpeed: 20,
            loop: false,
            backDelay: 1100,
            backSpeed: 10,
            showCursor: true,
            cursorChar: '|',
            onComplete: function (self) {
                self.cursor.style.display = 'none';
            }
        });
    }

    const grid = $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        percentPosition: true,
        filter: '.portfolio-featured'
    });

    // Function to update "More" button visibility
    function updateMoreButtonVisibility() {
        const isAllActive = $('.portfolio-filter[data-filter=".portfolio-featured"]').hasClass('active');
        $('.more-button').toggle(isAllActive);
    }

    updateMoreButtonVisibility();
    grid.imagesLoaded().progress(function() {
        grid.isotope('layout');
    });

    //Filter Galery Tags
    $("#portfolio .portfolio-filter").click(function() {
        $("#portfolio .portfolio-filter").removeClass('active');
        $(this).addClass('active');

        var selectedFilter = $(this).data("filter");
        //$("#portfolio-wrapper").fadeTo(100, 0);

        grid.isotope({ filter: selectedFilter });
        //setTimeout(function() {
        //$("#portfolio-wrapper").fadeTo(300, 1);
        //}, 300);
        updateMoreButtonVisibility();

    });


    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({
            id: 'mobile-nav'
        });
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function(e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    // Smooth scroll for the menu and links with .scrollto classes
    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space - 20;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });

    // Gallery carousel (uses the Owl Carousel library)
    $(".gallery-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0: { items: 2 },
            768: { items: 2 },
            992: { items: 3 },
            1200: { items: 3 }
        }
    });


    $(".portfolio-element").on("click", function () {
        var modal = document.getElementById("portfolioModal");
        modal.dataset.portfolio = this.dataset.portfolio;
        modal.dataset.type = this.dataset.type;
        modal.dataset.title = this.querySelector('.details h3').textContent;
        modal.dataset.subfolder = this.dataset.subfolder || "";
    });

    $('#portfolioModal').on('show.bs.modal', function () {
        var modal = this;
        $(this).find('.modal-body').empty().html('<p>Loading...</p>');
        $(this).find('.modal-title').text('');

        var pathToLoad = this.dataset.subfolder
            ? `img/${this.dataset.type}/${this.dataset.subfolder}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`
            : `img/${this.dataset.type}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`;

        $(this).find('.modal-body').load(pathToLoad, function (response, status, xhr) {
            if (status == "error") {
                console.log("Error loading content:", xhr.status, xhr.statusText);
                $(this).html('<p>Error loading content. Please try again.</p>');
            } else {
                $(modal).find('.modal-title').text(modal.dataset.title);
            }
        });
    });
   
});

const games = [
    {
        title: 'FingerFlipSunset',
        mainImage: 'img/games/FingerFlipSunset/thumbnail.png',
        video: 'img/games/FingerFlipSunset/video.mp4',
        sideImages: ['img/games/FingerFlipSunset/thumbnail.png', 'img/games/res/gmtk24.png'],
        year: 2024,
        award: '',
        description: "An arcade platformer inspired by everyone's back seat childhood roadtrip window imagination. \n Created in four days, this game embodies the 'Build to Scale' theme by playing with depth and perspective. ",
        downloadLink: 'https://franciscomurias.itch.io/fingerflip-sunset'
    },
    {
        title: 'TeatherNFeather',
        mainImage: 'img/games/TeatherNFeather/thumbnail.png',
        video: '',
        gallery: [
            'img/games/TeatherNFeather/gallery/1.jpg',
            'img/games/TeatherNFeather/gallery/2.jpg',
            'img/games/TeatherNFeather/gallery/3.jpg',
            'img/games/TeatherNFeather/gallery/4.jpg',
            'img/games/TeatherNFeather/gallery/5.jpg',
            'img/games/TeatherNFeather/gallery/6.jpg',
            'img/games/TeatherNFeather/gallery/7.png',
        ],
        sideImages: ['img/games/TeatherNFeather/thumbnail.png', 'img/games/res/gmtk21.png'],
        year: 2021,
        award: 'Game Jam Winner',
        description: 'Developed in 48 hours from the theme "Tied together" and Winner of the 2021 GMTK Game Jam with around 6 thousand games submitted. \n Tether n\' Feather is a 3D puzzle platformer game where you must guide two adorable parrots through relaxing and colorful islands.',
        downloadLink: 'https://franciscomurias.itch.io/tetherfeather'
    },
    {
        title: 'FlowState',
        mainImage: 'img/games/FlowState/thumbnail.png',
        video: '',
        gallery: [
            'img/games/FlowState/gallery/1.gif',
            'img/games/FlowState/gallery/2.gif',
            'img/games/FlowState/gallery/3.gif',
            'img/games/FlowState/gallery/4.gif',
            'img/games/FlowState/gallery/5.gif',
            'img/games/FlowState/gallery/1.jpg',
            'img/games/FlowState/gallery/2.jpg',
            'img/games/FlowState/gallery/3.jpg',
            'img/games/FlowState/gallery/4.jpg',
        ],
        sideImages: ['img/games/FlowState/thumbnail.png', 'img/games/res/ggj.png'],
        year: 2021,
        award: '',
        description: "Don't lose your flow. Parkour runner game in an about using your power to chose which parts of the level appear and disappear and keep your momentum. \n Made in two days from the theme 'Lost and Found'.",
        downloadLink: 'https://franciscomurias.itch.io/flow-state'
    },
    {
        title: 'BendingSpacetime',
        mainImage: 'img/games/BendingSpacetime/thumbnail.png',
        video: 'img/games/BendingSpacetime/video1.mp4',
        sideImages: ['img/games/BendingSpacetime/thumbnail.png', 'img/games/res/mnj20.png'],
        year: 2020,
        award: '',
        description: "In the space anomaly, be the last ship standing when space collapses on itself. \n 3D survival shooter in space. \n Developed in 32 hours for the Mix and Jam Game Jam 2020 in Unity.",
        downloadLink: 'https://infinitydragoon.itch.io/bending-spacetime'
    },
    {
        title: 'OverNOut',
        mainImage: 'img/games/OverNOut/thumbnail.png',
        video: '',
        gallery: [
            'img/games/OverNOut/gallery/1.png',
            'img/games/OverNOut/gallery/2.jpg',
            'img/games/OverNOut/gallery/3.png',
        ],
        sideImages: ['img/games/OverNOut/thumbnail.png', 'img/games/res/gmtk20.png'],
        year: 2020,
        award: '',
        description: '*roger, do you copy?* A Museum Heist gone out of control! Guide a cat through a museum exhibit and steal the precious artifact. \n Developed in 72 hours for the GMTK Game Jam 2020.',
        downloadLink: 'https://franciscomurias.itch.io/over-n-out'
    },
    {
        title: 'Shadowcasters',
        mainImage: 'img/games/Shadowcasters/thumbnail.png',
        video: '',
        gallery: [
            'img/games/Shadowcasters/gallery/2.png',
            'img/games/Shadowcasters/gallery/3.png',
        ],
        sideImages: ['img/games/Shadowcasters/thumbnail.png', 'img/games/res/tugcsgj.png'],
        year: 2019  ,
        award: '1st Place Winner',
        description: 'In the spirit of Halloween, witches use their spells to cast out the shadows and battle it out in this bomberman inspired game! \n Inspired by Jakub Wasilewski shadow shader implementation in PICO- 8.\nWinner of Teesside Game Jam 2019, made in 2 days with much love!',
        downloadLink: 'https://franciscomurias.itch.io/shadowcasters'
    },
    {
        title: 'Domain',
        mainImage: 'img/games/Domain/thumbnail.png',
        video: '',
        gallery: [
            'img/games/Domain/gallery/4.png',
            'img/games/Domain/gallery/3.png',
            'img/games/Domain/gallery/5.png',
            'img/games/Domain/gallery/6.png',
            'img/games/Domain/gallery/7.png',
        ],
        sideImages: ['img/games/Domain/thumbnail.png', 'img/games/res/retrojam.png'],
        year: 2017,
        award: '1st Place Winner',
        description: 'Two players battle for control of the domain. "3D"ish implementation in PICO-8. \n Winner of the Retro Jam 2017, made in 32 hours with much love.',
        downloadLink: 'https://franciscomurias.itch.io/domain-conflict'
    },
    {
        title: 'DungeonBombers',
        mainImage: 'img/games/DungeonBombers/thumbnail.png',
        video: '',
        gallery: [
            'img/games/DungeonBombers/gallery/2.png',
            'img/games/DungeonBombers/gallery/3.png',
            'img/games/DungeonBombers/gallery/4.gif',
        ],
        sideImages: ['img/games/DungeonBombers/thumbnail.png', ''],
        year: 2018,
        award: '',
        description: ' Small personal project consisting of a bomberman like game made with Love2D (lua). \n Meant to practice the skills required to produce all the art, code and music for a simple yet juicy and polished game.',
        downloadLink: 'https://github.com/FranciscoMurias/DungeonBomber'
    },
    {
        title: 'Reset',
        mainImage: 'img/games/Reset/thumbnail2.png',
        video: '',
        gallery: [
            'img/games/Reset/thumbnail2.png',
        ],
        sideImages: ['img/games/Reset/thumbnail.png', 'img/games/res/pggj2015.png'],
        year: 2015,
        award: '2nd Place Winner',
        description: 'Game developed for the Porto graphics Game Jam 2015 developed in Unity in 32 hours. \n This was my first developed videogame, at my first game jam.',
        downloadLink: './assets/RESET.zip'
    },
    {
        title: 'Displaced',
        mainImage: 'img/games/Displaced/thumbnail.png',
        gallery: [
            'img/games/Displaced/thumbnail.png',
        ],
        sideImages: ['img/games/Displaced/thumbnail.png', 'img/games/res/pggj2016.png'],
        year: 2016,
        award: 'Honorable Mention',
        description: 'Game developed for the Porto Graphics Game Jam 2016 developed in Unity in 32 hours. \nHonorable mention Winner for Creativity and Adaptation to theme.',
        downloadLink: './assets/Displaced.rar'
    }
];

//specialty links
var specialLinks = {
    "Winner of the 2021 GMTK Game Jam": "https://youtu.be/9U4Zoagd_40?t=643",
    // Add more entries here as needed
};

let currentIndex = 0;
let isTransitioning = false;

function updateGame(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const gamejamInfo = document.querySelector('.gamejam-info');
    gamejamInfo.classList.add('fade-out');

    setTimeout(() => {
        const game = games[index];
        const mainMediaContainer = document.getElementById('gamejam-main-media');


        // Clear previous content
        mainMediaContainer.innerHTML = '';

        if (game.video) {
            // If there's a video, create and append video element
            const videoElement = document.createElement('video');
            videoElement.src = game.video;
            videoElement.className = 'gamejam-main-video';
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.loop = true;
            videoElement.playsInline = true;
            mainMediaContainer.appendChild(videoElement);
        } else if (game.gallery && game.gallery.length > 0) {
            // If there's a gallery, create and append slideshow
            const slideshowElement = document.createElement('div');
            slideshowElement.id = 'gamejam-slideshow';
            game.gallery.forEach((imageSrc, i) => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.classList.add('slideshow-image');
                if (i === 0) img.classList.add('active');
                slideshowElement.appendChild(img);
            });
            mainMediaContainer.appendChild(slideshowElement);
            startSlideshow();
        }

        // Update other game details
        document.querySelector('.gamejam-year span').textContent = game.year;

        // Update award
        const awardContainer = document.querySelector('.award-container');
        const awardSpan = document.querySelector('.gamejam-award span');
        if (game.award && game.award.trim() !== '') {
            awardSpan.textContent = game.award;
            awardContainer.style.display = 'inline-flex';
            awardContainer.classList.add('shimmer-effect');
        } else {
            awardContainer.style.display = 'none';
            awardContainer.classList.remove('shimmer-effect');
        }

        // Update description
        const descriptionElement = document.querySelector('.gamejam-description');
        let description = game.description.replace(/\n/g, '<br>');

        // Check for special links
        Object.keys(specialLinks).forEach(key => {
            const regex = new RegExp(key, 'g');
            description = description.replace(regex, `<a href="${specialLinks[key]}" target="_blank">${key}</a>`);
        });

        descriptionElement.innerHTML = description;

        // Update side images
        const sideImages = document.querySelectorAll('.gamejam-side-image');
        sideImages[0].src = game.sideImages[0];
        sideImages[1].src = game.sideImages[1];

        // Update active tab
        document.querySelectorAll('.gamejam-tab').forEach((tab, idx) => {
            tab.classList.toggle('active', idx === index);
        });

        // Update download button
        const downloadButton = document.getElementById('game-download');
        if (game.downloadLink && game.downloadLink !== '#') {
            downloadButton.href = game.downloadLink;
            downloadButton.style.display = 'inline-block';
            downloadButton.target = "_blank";
        } else {
            downloadButton.style.display = 'none';
        }

        // Fade in the content
        gamejamInfo.classList.remove('fade-out');
        isTransitioning = false;
    }, 300); // This timeout should match the transition duration in CSS
}

function startSlideshow() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slideshow-image');

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 2600); // Change slide every 3 seconds
    }
}

function createTabs() {
    const tabsContainer = document.querySelector('.gamejam-tabs');
    games.forEach((game, index) => {
        const tab = document.createElement('img');
        tab.classList.add('gamejam-tab');
        tab.src = game.mainImage;
        tab.alt = game.title;
        tab.addEventListener('click', () => {
            currentIndex = index;
            updateGame(currentIndex);
        });
        tabsContainer.appendChild(tab);
    });
}

document.querySelector('.gamejam-prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + games.length) % games.length;
    updateGame(currentIndex);
});

document.querySelector('.gamejam-next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % games.length;
    updateGame(currentIndex);
});

// Make sure to call updateGame(0) when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateGame(0);
});

createTabs();
updateGame(currentIndex);


$('#portfolioModal').on('show.bs.modal', function () {
    var modal = this;
    $(this).find('.modal-body').load(`img/${this.dataset.type}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`, function () {
        $(this).find('.modal-title').text(modal.dataset.title);
        
        // Apply custom behavior to carousel after content is loaded
        customizeCarousel(modal);
    });
});

// Function to customize carousel behavior
function customizeCarousel(modal) {
    var carousel = $(modal).find('.carousel');
    var indicators = $(modal).find('.carousel-indicators .list-inline-item');

    function updateCarouselAndIndicator(index) {
        carousel.carousel('pause');
        carousel.carousel(index);
        indicators.removeClass('active');
        indicators.eq(index).addClass('active');

        // Check if the new active item is a video and play it
        playVideoIfPresent(carousel.find('.carousel-item').eq(index));
    }

    function playVideoIfPresent(carouselItem) {
        var video = carouselItem.find('video')[0];
        if (video) {
            video.currentTime = 0; // Reset video to start
            video.play();
        }
    }

    indicators.off('click').on('click', function (e) {
        e.preventDefault();
        var index = $(this).data('slide-to');
        updateCarouselAndIndicator(index);
    });

    $(modal).find('.carousel-control-prev').off('click').on('click', function (e) {
        e.preventDefault();
        var index = carousel.find('.carousel-item.active').index();
        var prevIndex = (index - 1 + carousel.find('.carousel-item').length) % carousel.find('.carousel-item').length;
        updateCarouselAndIndicator(prevIndex);
    });

    $(modal).find('.carousel-control-next').off('click').on('click', function (e) {
        e.preventDefault();
        var index = carousel.find('.carousel-item.active').index();
        var nextIndex = (index + 1) % carousel.find('.carousel-item').length;
        updateCarouselAndIndicator(nextIndex);
    });

    carousel.on('slid.bs.carousel', function () {
        var activeItem = $(this).find('.carousel-item.active');
        playVideoIfPresent(activeItem);
    });

    // Pause video when leaving the item
    carousel.on('slide.bs.carousel', function () {
        var activeItem = $(this).find('.carousel-item.active');
        var video = activeItem.find('video')[0];
        if (video) {
            video.pause();
        }
    });

    carousel.on('mouseleave', function () {
        carousel.carousel('cycle');
    });
}

$(document).ready(function () {
    function scrollModalToTop(modal) {
        setTimeout(function () {
            var scrollElement = $(modal).find('.simplebar-content-wrapper');
            if (scrollElement.length) {
                scrollElement.scrollTop(0);
            } else {
                $(modal).find('.modal-body').scrollTop(0);
            }
        }, 150);
    }

    $('#portfolioModal').on('show.bs.modal', function () {
        var modal = this;
        $(this).find('.modal-body').empty().html('<p>Loading...</p>');
        $(this).find('.modal-title').text('');

        $(this).find('.modal-body').load(`img/${this.dataset.type}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`, function () {
            $(this).find('.modal-title').text(modal.dataset.title);
            customizeCarousel(modal);
            scrollModalToTop(modal);
        });
    });

    $('#portfolioModal').on('hide.bs.modal', function () {
        $(this).find('video').each(function () {
            this.pause();
        });
    });
});