/**
 * --------------------------------
 * Common JS
 * --------------------------------
 */

window.addEventListener('load', () => {
	/* common // */

	// accordion
	fn.accordion();

	// select
	fn.select('.select');
	fn.formSelect('.form-select');

	// input file
	fn.fileUpload();

	// input file : img
	fn.filePicInit();
	fn.filePicUpload();

	// input file : multi
	fn.fileMultiInit();
	fn.fileMultiUpload();

	// input search
	fn.searchDelete();

	// input price
	fn.priceDelete();

	// tab menu
	fn.tabMenu();

	// tooltip
	fn.tooltip();

	if (document.querySelector('input[data-ref="btn-checkall"]')) {
		fn.inputAllCheck();
	}

	// datepicker
	$('.datepicker').each(function() {
		$(this).find('input').datepicker({
			dateFormat: 'yy.mm.dd',
			prevText: '이전 달',
			nextText: '다음 달',
			numberOfMonths: 2,
			monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
		}).datepicker('setDate', new Date());
	});

	// coarchmark가 있을 떄
	if($('.coarchmark').length > 0) {
		$('.coarchmark').each(function() {
			var $this =	$(this);
	
			if($this.hasClass('active')) {
				$('body').addClass('fixed');
			} else {
				$('body').removeClass('fixed');
			}
	
			$this.find('.next-btn').on('click', function() {
				let step = $this.find('.step');
				let stepLength = step.length;
				let stepActive = $this.find('.step.active');
				let stepIndex = stepActive.index();
				let stepNext = step.eq(stepIndex + 1);

				step.removeClass('active');
				stepNext.addClass('active');
				if (!stepIndex < stepLength - 2) {
					$(this).text('닫기');
					$this.find('.link').addClass('active');
					$(this).on('click', function() {
						$this.removeClass('active');
					});
					$('body').removeClass('fixed');
				}
			});
			$this.find('.close-btn').on('click', function() {
				$this.removeClass('active');
				$('body').removeClass('fixed');
			});
		});
	}

	
	if($('.popupamountadjustment').length > 0) {
		$('.virtual-account .option').click(function() {
			$('.virtual-account .btn').attr('disabled', false);
		});

		$(".virtual-account .btn").click(function() {
			$('.account-area').addClass('active');
		});

		$('.form-entry').each(function() {
			var $this = $(this);

			$(this).find('.direct-area input').on('input', function() {
				$('.direct-area .btn').attr('disabled', false);
			});


			$(this).find('.method-entry .direct').on('change', function() {
				if($(this).prop('checked') == true) {
					$this.find('.direct-area').addClass('active');
					$this.find('.post-area').removeClass('active');
				} else if ($(this).prop('checked') == false){
					$this.find('.direct-area').removeClass('active');
					$this.find('.post-area').addClass('active');
				}
			});

			$(this).find('.method-entry .post').on('change', function() {
				if($(this).prop('checked') == true) {
					$this.find('.post-area').addClass('active');
					$this.find('.direct-area').removeClass('active');
				} else if ($(this).prop('checked') == false) {
					$this.find('.post-area').removeClass('active');
					$this.find('.direct-area').addClass('active');
				}
			});
		});
	};


	// daterangepickers
	$('.daterangepickers').each(function() {
		const isSingle = $(this).hasClass('single');
		const isRight = $(this).hasClass('center');

		$(this).find('input').daterangepicker({
			autoApply: true,
			singleDatePicker: isSingle,
			drops: 'auto',
			opens: isRight ? 'center' : 'right',
			locale: {
				separator: " ~ ",
				format: 'YYYY.MM.DD',
				daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
				monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			}
		})

		$(this).find('input').on('show.daterangepicker', function(ev, picker) {
			if($('.popup.active').length) {
				$('body').addClass('date-open')
			} else {
				$('body').removeClass('date-open')
			}
		});

		$(this).find('input').on('hide.daterangepicker', function(ev, picker) {
			if($('.popup.active').length) {
				$('body').removeClass('date-open')
			} 
		});
	});

	// listsorting
	document.querySelectorAll('.list-sort').forEach(list => {
		const inputAll = Array.from(list.querySelectorAll('label > input'));
		inputAll.forEach(input => {
			input.addEventListener('change', () => {
				inputAll.forEach(i => i !== input && (i.checked = i.checked && false));
			});
		});
	});

	// listsorting
	$('.sorting-container').each(function() {
		$(this).find('.input-btn').on('click', function() {
			$(this).parent('.sorting-container').toggleClass('active');
		});
	});

	// header tab swiper
	if (document.querySelector('#header .tab-swiper')) {
		fn.headerTabSwiper(0, 'load');
	}

	/* // common */

	/* page // */
	let depth = {};
	if ( document.getElementById('contents') ) {
		depth = document.getElementById('contents').getAttribute('class').split(' ') || '';
	}

	switch(depth[0]) {
		// 로그인
		case 'member':
			switch(depth[1]) {
				case 'login' :
					const bgInterval = setInterval(() => {
						document.querySelector('.login-area').classList.toggle('active');
					}, 6000);

					const 
						formToggle = document.querySelector('.form-toggle'),
						checkbox = formToggle.querySelector('input[type="checkbox"]'),
						txt = formToggle.querySelector('.txt');

						checkbox.addEventListener('change', () => {
						txt.textContent = checkbox.checked ? '회원권 소개 메인' : '대시보드 메인';
					});
					break;
			}
			break;

		// main
		case 'main':
			// graph swiper
			fn.graphSwiper();
			fn.timePickerInit('#editstartTime', '#editendTime', 'load');

			$('.toastpopup').find('.btn-close').on('click', function() {
				$(this).closest('.toastpopup').removeClass('active');
			});
			if (depth[1]) {
				switch(depth[1]) {
					case 'vip':

					$('.table-area').each(function() {
						const tableArea = $(this);
						const tableBodySwiper = new Swiper(tableArea.find('.table-swiper > .swiper')[0], {
							slidesPerView: 'auto',
							spaceBetween: 0,
							freeMode : true,
							navigation: {
								nextEl: tableArea.find('.swiper-button-next')[0],
								prevEl: tableArea.find('.swiper-button-prev')[0],
							},
						});
			
						const tableHeadSwiper = new Swiper(tableArea.find('.table-head-swiper > .swiper')[0], {
							slidesPerView: 'auto',
							spaceBetween: 0,
							freeMode : true,
							navigation: {
								nextEl: tableArea.find('.swiper-button-next')[0],
								prevEl: tableArea.find('.swiper-button-prev')[0],
							},
						});
			
						const tableFooterSwiper = new Swiper(tableArea.find('.table-footer-swiper > .swiper')[0], {
							slidesPerView: 'auto',
							spaceBetween: 0,
							freeMode : true,
							navigation: {
								nextEl: tableArea.find('.swiper-button-next')[0],
								prevEl: tableArea.find('.swiper-button-prev')[0],
							},
						});
						tableBodySwiper.controller.control = [tableHeadSwiper, tableFooterSwiper];
						tableHeadSwiper.controller.control = [tableFooterSwiper, tableBodySwiper];
					});

					
					$('.performance-table').each(function() {
						const performanceSlide = $(this).find('.table-swiper .swiper-slide');
						const performanceRight = $(this).find('.table-right .table-coloum');

						$(this).find('.table-left').find('.view-more').on('click', function() {
							$(this).closest('.table-item').parent('.view-content').toggleClass('active');
							let i = $(this).closest('.table-item').parent('.view-content').index();

							performanceSlide.each(function() {
								$(this).find('.body-item-wrap').eq(i).find('.view-content').toggleClass('active')
							});

							performanceRight.each(function() {
								$(this).find('.right-item-wrap').eq(i).find('.view-content').toggleClass('active')
							});

						});
					});
					
					break;

					case 'objectives' :

					break;
				}
			}
			break;

		// membership
		case 'membership':
			if (depth[1]) {
				switch(depth[1]) {
					case 'main':
						const mainLayoutSwiper = new Swiper('.mainlayout-swiper > .swiper', {
							direction: 'vertical',
							speed: 600,
							navigation: {
								nextEl: '.mainlayout-swiper .swiper-button-next',
								prevEl: '.mainlayout-swiper .swiper-button-prev',
							},
							on: {
								slideChangeTransitionStart: () => {
									const videos = document.querySelectorAll('.video video');

									if (videos.length) {
										Array.from(videos).forEach(video => {
											video.pause();
											video.currentTime = 0;
											setTimeout(() => video.play())
										});
									}
								},
							}
						});

						const mainSwiper = new Swiper('.main-swiper .swiper', {
							effect: 'fade',
							speed: 700,
							autoplay: {
								delay: 5000,
							},
							loop: true,
						});

						break;

					case 'view':
						fn.viewTabSwipers();
						fn.viewLayoutSwipers();
						fn.viewSwipers();
						break;
				
					case 'recommend' :
						const cardSwiper = new Swiper('.card-swiper .swiper', {
							slidesPerView: 'auto',
							spaceBetween: 8,
							// slidesOffsetBefore: 0,
							// centeredSlides: true,
							navigation: {
								nextEl: '.card-swiper .swiper-button-next',
								prevEl: '.card-swiper .swiper-button-prev',
							},
						});
					break;

					case 'assignment' :
						const assignmentSwiper = new Swiper('.assignment-swiper .swiper', {
							slidesPerView: 'auto',
							spaceBetween: 16,
						});
						break;

					case 'management' :
						const assignmentSwiper1 = new Swiper('.assignment-swiper .swiper', {
							slidesPerView: 'auto',
							spaceBetween: 8,
						});
						break;
					}
			}
			break;

		// customer
		case 'customer':
			$('.btn-more').each(function() {
				$(this).on('click', function() {
					let detailInner = $(this).closest('.accordion-cont').find('.inner');
					let detailInnerHide = detailInner.find('.hide');
					let accordion = $(this).closest('.accordion-cont');

					if($(this).closest('.tendency').length > 0) {
						
						detailInnerHide.toggleClass('active');
						$(this).toggleClass('active');

						if(detailInnerHide.hasClass('active') == true){
							$(this).find('span').text('성향 접어보기');
						} else {
							$(this).find('span').text('성향 더보기');
						}
					} else {
						detailInnerHide.addClass('active');
					}

					if(detailInnerHide.hasClass('active') == true){
						accordion.css({
							maxHeight:	detailInner.outerHeight() + 'px'
						});
					} else {
						accordion.css({
							maxHeight: detailInner.outerHeight() + 'px'
						});
					}
				});
			});

			function initializeAccordions() {
				let accordions = document.querySelectorAll('.list-accordion');
				accordions.forEach((accordion) => {
					let accordionLis = accordion.querySelectorAll('li');
					let heightAutoAccordion = accordion.classList.contains('customer-detail');
					
					accordionLis.forEach((accordionLi) => {
						let accordionTi = accordionLi.querySelector('.accordion-ti');
						if (heightAutoAccordion && accordionLi.querySelector('.inner')) {
							let accordionCont = accordionLi.querySelector('.accordion-cont');
							let inner = accordionCont.querySelector('.inner');

							if (inner && accordionCont) {
								if (accordionLi.classList.contains('active')) {
									accordionCont.style.maxHeight = `${inner.clientHeight}px`;
								} else {
									accordionCont.style.maxHeight = '0';
								}
							}
						}
					});
				});
			}

			initializeAccordions();

			// membership-swiper
			if (document.querySelector('.membership-swiper .swiper')) {
				const swiper = new Swiper('.membership-swiper .swiper', {
					slidesPerView: 'auto',
					spaceBetween: 12,
				});
			}

			// upcoming-swiper
			if (document.querySelector('.upcoming-birth .swiper')) {
				const upcomingSwiper = new Swiper('.upcoming-birth .swiper', {
					slidesPerView: 'auto',
					spaceBetween: 4,
				});
			}

			// today-swiper
			if (document.querySelector('.today-birth .swiper')) {
				const todaySwiper = new Swiper('.today-birth .swiper', {
					slidesPerView: 'auto',
					spaceBetween: 4,
				});
			}
			break;

		// contract
		case 'contract':
			

			break;

		// activities
		case 'activity':
			fn.timePickerInit('#editstartTime', '#editendTime', 'load');
			break;

		// tour
		case 'tour' :
			const selectCourseInput = Array.from(document.querySelectorAll('#popupGolfLocationSelect .input-sorting input'));
			const searchCoursecheckboxAll = Array.from(document.querySelectorAll('#popupGolfLocationSelect .input-sorting input[type="checkbox"]'));
			const searchCourseRadio = document.querySelector('#popupGolfLocationSelect .input-sorting input[type="radio"]');

			selectCourseInput.forEach(input => {
				input.addEventListener('change', () => {
					if (input.getAttribute('type') === 'radio') { // radio
						searchCoursecheckboxAll.forEach(checkbox => {
							checkbox.checked = false;
						})
					} else { // checkbox
						if (searchCoursecheckboxAll.some(checkbox => checkbox.checked)) {
							searchCourseRadio.checked = false;
						} else if (!searchCoursecheckboxAll.filter(checkbox => checkbox.checked).length) {
							searchCourseRadio.checked = true;
						}
					}
				})
			});
			break;
	}
	/* // page */

});

