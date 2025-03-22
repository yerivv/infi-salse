/**
* --------------------------------
* Function JS
* --------------------------------
*/

const fn = (() => {
	'use strict';

	let
		scrollt = 0,
		isMoved = false,
		logoutInterval,
		cTimeInterval,
		starthourswiper,
		endhourswiper,
		headerTabSwiper,
		graphswiper,
		viewTabSwiper,
		viewLayoutSwiper,
		viewSwiper = [];

	return {
		// header tab swiper
		headerTabSwiper: (index = 0, state) => {
			if (state === 'load') {
				if (headerTabSwiper) headerTabSwiper.destroy();

				headerTabSwiper = new Swiper('.tab-swiper .swiper', {
					slidesPerView: 'auto',
					spaceBetween: 4,
					initialSlide: index,
				});
			} else {
				headerTabSwiper.update();
				headerTabSwiper.slideTo(index);
			}

			const header = document.getElementById('header');

			if (header.querySelector('.tab-swiper .swiper-slide > a')) {
				header.querySelectorAll('.tab-swiper .swiper-slide > a.active').forEach(btn => {
					btn.classList.remove('active');
				});

				header.querySelectorAll('.tab-swiper .swiper-slide > a')[index].classList.add('active');
			}
		},

		// objTypeCheck
		objTypeCheck: target => {
			if (typeof target !== 'string') {
				return target;
			} else if (document.querySelector(`[data-ref="${target}"]`) === null) {
				return document.querySelector(target);
			} else {
				return document.querySelector(`[data-ref="${target}"]`);
			}
		},

		// toggleActive
		toggleActive: target => {
			fn.objTypeCheck(target).classList.toggle('active');
		},

		// addActive
		addActive: target => {
			fn.objTypeCheck(target).classList.add('active');
		},

		// removeActive
		removeActive: target => {
			fn.objTypeCheck(target).classList.remove('active');
		},

		// top
		top: () => {
			window.scrollTo({top: 0, behavior: 'smooth'});
		},

		// select
		select: (target, type) => {
			const selects = document.querySelectorAll(target);

			selects.forEach((selectArea) => {
				let
					select = selectArea.querySelector('select'),
					options = select.querySelectorAll('option'),
					template = '<div class="dropdown" tabindex="0"><span class="current"></span><i class="icon icon-select"></i><div class="list"><div class="scrollbar"><div class="scroll-content"><ul></ul></div></div></div></div>';

				if (!(selectArea.querySelector('.dropdown')) || type == 'reset') {
					select.disabled ? selectArea.classList.add('disabled') : selectArea.classList.remove('disabled');

					if (type == 'reset') selectArea.querySelector('.dropdown').remove();

					// dropdown make
					selectArea.insertAdjacentHTML('beforeend', template);

					let
						dropdown = selectArea.querySelector('.dropdown'),
						current = selectArea.querySelector('.current');

					current.innerHTML = select.options[select.selectedIndex].label;

					// option make
					options.forEach((option) => {
						let
							selectTi = option.classList.contains('select-ti'),
							selected = option.selected,
							disabled = option.disabled,
							value = option.value,
							html = option.innerHTML;

						if (selectTi) {
							dropdown.querySelector('ul').insertAdjacentHTML('beforeend', '<li class="option select-ti' + (selected ? ' selected' : '') + (disabled ? ' disabled' : '') + '" data-value="' + value + '"><span>' + html + '</span></li>');
							if (!selected) dropdown.classList.add('active');
						} else {
							dropdown.querySelector('ul').insertAdjacentHTML('beforeend', '<li class="option' + (selected ? ' selected' : '') + (disabled ? ' disabled' : '') + '" data-value="' + value + '"><span>' + html + '</span></li>');
						}
					});

					// select click
					dropdown.addEventListener('click', () => {
						if (selectArea.classList.contains('disabled')) return;

						document.querySelectorAll('.select .dropdown').forEach(d => {
							(d !== dropdown) && d.classList.remove('open');
						})

						dropdown.classList.contains('open') ? dropdown.classList.remove('open') : dropdown.classList.add('open');

						if (dropdown.classList.contains('open')) {
							dropdown.querySelectorAll('.option').forEach(function(option) {
								option.setAttribute('tabindex', '0');
							});
							dropdown.querySelector('.selected').focus();
						} else {
							dropdown.querySelectorAll('.option').forEach(function(option) {
								option.removeAttribute('tabindex');
							});
							dropdown.focus();
						}
					});

					// options click
					let optionList = selectArea.querySelectorAll('.list .option');
					optionList.forEach((option) => {
						option.addEventListener('click', () => {
							if (!option.classList.contains('disabled')) {
								let optionText = option.querySelector('span').innerHTML;
								optionList.forEach(function(option) {
									option.classList.remove('selected');
								});
								option.classList.add('selected');
								current.innerHTML = optionText;
								option.classList.contains('select-ti') ? dropdown.classList.remove('active') : dropdown.classList.add('active');
								for (let i = 0 ; i < select.options.length ; i++) {
									if (select.options[i].innerHTML == optionText) {
										select.options[i].selected = true;
										select.dispatchEvent(new Event('change'));
									}
								}
							}
						});
					});

					// keyboard events
					dropdown.addEventListener('keydown', (e) => {
						let focusedOption = dropdown.querySelector('.option:focus') || dropdown.querySelector('.option.selected');

						if (e.keyCode == 32 || e.keyCode == 13) {	// Space or Enter
							dropdown.classList.contains('open') ? focusedOption.click() : dropdown.click();
							e.preventDefault();
						} else if (e.keyCode == 40) {	// Down
							if (!dropdown.classList.contains('open')) {
								dropdown.click();
							} else {
								if (focusedOption.nextSibling) {
									focusedOption.nextSibling.focus();
									focusedOption.classList.remove('selected');
									focusedOption.nextSibling.classList.add('selected');
								}
							}
							e.preventDefault();
						} else if (e.keyCode == 38) {	// Up
							if (!dropdown.classList.contains('open')) {
								dropdown.click();
							} else {
								if (focusedOption.previousSibling) {
									focusedOption.previousSibling.focus();
									focusedOption.classList.remove('selected');
									focusedOption.previousSibling.classList.add('selected');
								}
							}
							e.preventDefault();
						} else if (e.keyCode == 27) {	// Esc
							if (dropdown.classList.contains('open')){
								dropdown.click();
							}
							e.preventDefault();
						}
					});
				}
			});

			// select close
			window.addEventListener('click', (e) => {
				let dropdowns = document.querySelectorAll('.select .dropdown');
				if (e.target.closest('.select .dropdown') === null) {
					dropdowns.forEach((dropdown) => {
						dropdown.classList.remove('open');
					});
				}
				e.stopPropagation();
			});
		},

		// select checkbox
		formSelect: (target, type) => {
			const formSelects = document.querySelectorAll(target);

			formSelects.forEach(formSelect => {
				let
					dropdown = formSelect.querySelector('.dropdown'),
					current = formSelect.querySelector('.current'),
					options = formSelect.querySelectorAll('.option');

				if (type == 'reset') formSelect.classList.remove('active');
				if (formSelect.classList.contains('active')) return;

				// init
				// formSelect.classList.remove('checked');

				const isChecked = [...options].some(rd => rd.checked);

				if (isChecked) {
					formSelect.querySelectorAll('.option:checked').forEach(option => {
						const txtValue = option.nextElementSibling.textContent;
						const txt = document.createElement('span');
						txt.classList.add('option-txt');
						txt.innerText = txtValue;
						current.append(txt);	
					});

					// number label
					const length = formSelect.querySelectorAll('.option:checked').length;

					if (length > 2) {
						if (formSelect.querySelector('.current .num')) {
							formSelect.querySelector('.current .num').textContent = `${length - 2}`;
						} else {
							const num = document.createElement('span');
							const icon = document.createElement('i');
							num.classList.add('num');
							icon.classList.add('svgicon', 'svgicon-plus');
							num.append(icon,`${length - 2}`);
							current.append(num);
						}
					} else {
						formSelect.querySelector('.current .num') && formSelect.querySelector('.current .num').remove();
					}
				}

				if (!(type == 'reset')) {
					// btn click
					current.addEventListener('click', () => {
						if (formSelect.classList.contains('disabled')) return;

						isMoved = false;

						if (formSelect.classList.contains('open')) {
							formSelect.classList.remove('open');
							current.focus();
						} else {
							document.querySelectorAll(target).forEach(el => {
								el.classList.remove('open');
							});
							formSelect.classList.add('open');
							if (dropdown.querySelector('.option:checked')) {
								dropdown.querySelector('.option:checked').focus();
							}
						}
					});

					// keyboard events
					dropdown.addEventListener('keydown', (e) => {
						let focusedOption = dropdown.querySelector('label:focus') || dropdown.querySelector('.option:checked') || current;

						if (e.keyCode == 13) { // Enter
							e.preventDefault();
							isMoved = false;
							formSelect.classList.contains('open') ? focusedOption.click() : current.click();
						} else if (e.keyCode == 27) {	// Esc
							isMoved = false;
							if (formSelect.classList.contains('open')) formSelect.classList.remove('open');
						} else if (e.keyCode == 40) {	// Down
							isMoved = true;
						} else if (e.keyCode == 38) {	// Up
							isMoved = true;
						} else if (e.key === 'Tab' && document.activeElement === current && e.shiftKey) {
							formSelect.classList.remove('open');
						}
					});

					dropdown.addEventListener('mousedown', () => {
						isMoved = false;
					});
				}

				// label checkbox click
				options.forEach((option) => {
					option.addEventListener('click',() => {
						// const txtValue = option.nextElementSibling.textContent;
						// const checkedOpt = [...options].filter(rd => rd.checked);
						const length = formSelect.querySelectorAll('.option:checked').length;

						let html = `<span class="select-ti">${formSelect.querySelector('.current .select-ti').textContent}</span>`;

						formSelect.querySelectorAll('.option:checked').forEach(opt => {
							const txt = opt.nextElementSibling.textContent;

							html += `<span class="option-txt">${txt}</span>`;
						});

						current.innerHTML = html;

						// number label
						if (length > 2) {
							if (formSelect.querySelector('.current .num')) {
								formSelect.querySelector('.current .num').textContent = `${length - 2}`;
							} else {
								const num = document.createElement('span');
								const icon = document.createElement('i');
								num.classList.add('num');
								icon.classList.add('svgicon', 'svgicon-plus');
								num.append(icon,`${length - 2}`);
								current.append(num);
							}
						} else {
							formSelect.querySelector('.current .num') && formSelect.querySelector('.current .num').remove();
						}

						// option.classList.contains('select-ti') ? formSelect.classList.remove('checked') : formSelect.classList.add('checked');
						if (!isMoved) {
							// formSelect.classList.remove('open');
							current.focus();
						}
					});
				});
			});

			// select close
			window.addEventListener('click', (e) => {
				let dropdowns = document.querySelectorAll('.form-select');
				if (e.target.closest('.form-select') === null) {
					dropdowns.forEach((dropdown) => {
						dropdown.classList.remove('open');
					});
				}
				e.stopPropagation();
			});
		},

		// all checkbox
		inputAllCheck: () => {
			const
				checkAllCheckbox = document.querySelector('input[data-ref="btn-checkall"]'),
				individualCheckboxes = document.querySelectorAll('input[data-ref="check-agree"]');

			checkAllCheckbox.addEventListener('change', () => {
				individualCheckboxes.forEach(checkbox => {
					checkbox.checked = checkAllCheckbox.checked;
				});
			});

			individualCheckboxes.forEach((checkbox) => {
				checkbox.addEventListener('change', () => {
					if (!checkbox.checked) {
						checkAllCheckbox.checked = false;
					} else {
						checkAllCheckbox.checked = [...individualCheckboxes].every((cb) => {
							return cb.checked;
						});
					}
				});
			});
		},

		// search delete
		searchDelete: () => {
			const searchInputs = document.querySelectorAll('.form-search input[type="text"]');

			searchInputs.forEach((searchInput) => {
				let btnDelete = searchInput.parentElement.querySelector('.btn-delete');

				['focusin', 'keyup', 'focusout'].forEach(eventType => {
					searchInput.addEventListener(eventType, () => {
						if (searchInput.value !== '') {
							btnDelete.style.display = 'block';
						} else {
							btnDelete.style.display = 'none';
						}
					});
				});

				btnDelete.addEventListener('click', () => {
					searchInput.value = '';
					searchInput.focus();
				});
			});

			const formEntrys = document.querySelectorAll('.form-entry:has(.btn-delete) input[type="text"]');

			formEntrys.forEach((formEntry) => {
				let btnDelete = formEntry.parentElement.querySelector('.btn-delete');

				['focusin', 'keyup', 'focusout'].forEach(eventType => {
					formEntry.addEventListener(eventType, () => {
						if (formEntry.value !== '') {
							btnDelete.style.display = 'block';
						} else {
							btnDelete.style.display = 'none';
						}
					});
				});

				btnDelete.addEventListener('click', () => {
					formEntry.value = '';
					formEntry.focus();
				});
			});
		},

		// price delete
		priceDelete: () => {
			const priceInputs = document.querySelectorAll('.form-price input[type="text"]');

			priceInputs.forEach((priceInput) => {
				let btnDelete = priceInput.parentElement.querySelector('.btn-delete');

				btnDelete.addEventListener('click', () => {
					priceInput.value = '';
					priceInput.focus();
				});

				['focusin', 'keyup'].forEach(eventType => {
					priceInput.addEventListener(eventType, () => {
						if (priceInput.value !== '') {
							btnDelete.style.display = 'block';
							priceInput.parentElement.classList.add('active', 'focused');
						} else {
							btnDelete.style.display = 'none';
							priceInput.parentElement.classList.remove('active', 'focused');
						}
					});
				});

				priceInput.addEventListener('focusout', () => {
					priceInput.parentElement.classList.remove('focused');
					setTimeout(() => btnDelete.style.display = 'none')
				})
			});
		},

		// fileUpload
		fileUpload: target => {
			let fileForms = target ? document.querySelectorAll(target) : document.querySelectorAll('.form-btn.form-fileupload');

			fileForms.forEach((fileForm) => {
				let
					fileLabel = fileForm.querySelector('label.btn'),
					fileInput = fileForm.querySelector('input[type="file"]'),
					fileNameInput = fileForm.querySelector('.inp-upfilename'),
					filedeleteBtn = fileForm.querySelector('.btn-delete');

				fileLabel.setAttribute('tabindex','0');

				fileInput.addEventListener('change', () => {
					let
						fileMaxSize = fileForm.dataset.maxsize,
						fileMaxSizeMsg = fileForm.dataset.maxsizemsg ? fileForm.dataset.maxsizemsg : '첨부파일 용량이 초과되었습니다.',
						fileFormat = fileForm.dataset.format,
						fileFormatMsg = fileForm.dataset.formatmsg ? fileForm.dataset.formatmsg : '첨부파일 확장자를 확인해주세요.',
						fileCurrentSize = 0,
						fileCurrentFormat = fileFormat.toLowerCase().replace(/\, /g, '|'),
						fileReader = new FileReader();

					if (fileInput.files.length) {
						fileCurrentSize = fileInput.files[0].size;

						if (fileCurrentSize > fileMaxSize * 1024 * 1024) {
							alert(fileMaxSizeMsg);
							fileInput.value = '';
							fileNameInput.value = '';
							fn.removeActive(fileForm);
							return;
						} else {
							fileReader.readAsDataURL(fileInput.files[0]);
							fileReader.addEventListener('loadstart', () => {
								fn.loadingOpen();
							});

							fileReader.addEventListener('load', () => {
								let
									fileIdx = Number(fileInput.dataset.value) || fileForm.querySelectorAll('input[type="file"]').length-1,
									fileFullName = fileInput.files[0].name,
									fileLastName = fileFullName.toLowerCase().substring(fileFullName.lastIndexOf('.')+1, fileFullName.length),
									fileSize = fileInput.files[0].size;

								if (fileCurrentFormat.indexOf(fileLastName) > -1) {
									if (!fileInput.getAttribute('data-value')) {
										fileInput.setAttribute('data-value', fileIdx);
										fileInput.setAttribute('data-size', fileSize);
									}
									fileNameInput.value = fileFullName;
									fn.addActive(fileForm);
								} else {
									alert(fileFormatMsg);
									fileInput.value = '';
									fileNameInput.value = '';
									fn.removeActive(fileForm);
									return;
								}
							});

							fileReader.addEventListener('loadend', () => {
								fn.loadingClose();
							});
						}
					}
				});

				filedeleteBtn.addEventListener('click', () => {
					fileInput.value = '';
					fileNameInput.value = '';
					fn.removeActive(fileForm);
				});
			});
		},

		//filePicInit
		filePicInit : function() {
			$('.form-filepic').each(function() {
				var $this = $(this);

				$this.find('.upload-filepic').removeClass('last');
				if ( $this.find('.upload-filepic:last').find('.upload-display').length <= 0 ){
					$this.find('.upload-filepic:last').addClass('last');
				}
			});
		},

		//filePicUpload
		filePicUpload : function() {
			//file upload
			$(document).on('change', '.upload-filepic .upload-hidden', function(){
				var $this = $(this),
					$parent = $this.parent().parent(),
					$parentarea = $this.closest('.form-filepic'),
					inputName = $this.attr('name'),
					reader = new FileReader(),
					fileMaxSize = Number($parentarea.attr('data-maxsize')),
					fileCurrentSize = 0,
					fileMaxLength = Number($parentarea.attr('data-maxlength')),
					fileCurrentLength = 0,
					errorbox = this;

				fn.inputErrorClear(errorbox);

				$parentarea.find('input[data-size]').each(function(){
					fileCurrentSize += Number($(this).attr('data-size'));
					fileCurrentLength++;
				});

				if (fileCurrentSize + $this[0].files[0].size > fileMaxSize * 1024 * 1024) {
					fn.inputError(errorbox, '첨부파일 제한용량을 초과하였습니다.' + fileMaxSize + 'MB 이하로 첨부파일을 올려주세요.', 'error');
					$this.removeAttr('data-size');
				} else {
					reader.onloadstart = function(){
						fn.loadingOpen();
					}

					$parent.children('.upload-display').remove();
					$parent.removeClass('vertical');

					if (!$this[0].files[0].type.match(/image\//)) return;

					reader.onload = function(e){
						var src = e.target.result,
							fileIdx = Number($this.attr('data-value')) || $parent.find('input').length-1,
							fileSize = $this[0].files[0].size,
							fileFullName = $this[0].files[0].name,
							fileLastName = fileFullName.toLowerCase().substring(fileFullName.lastIndexOf('.')+1, fileFullName.length);

						if (!$this.attr('[data-value]')) {
							$this.attr({'data-value':fileIdx, 'data-size':fileSize});
						}
						$parent.append('<div class="upload-display"><img src="'+src+'" alt="" class="upload-thumb"></div><span class="txt-filename">' + fileFullName + '</span><button type="button" class="btn-delete"><i class="svgicon svgicon-filedelete"></i></button>');

						var im = new Image();
						im.src = src;
						im.onload = function(){
							if ( im.width > im.height ){
								$parent.addClass('vertical');
							}
						}
					}

					reader.onloadend = function (){
						fn.loadingClose();
					}

					reader.readAsDataURL($(this)[0].files[0]);

					if ( fileCurrentLength+1 < fileMaxLength ){
						$parentarea.find('.form-filepicupload').prepend(
							'<div class="upload-filepic">' +
								'<label class="btn line"><input type="file" name="' + inputName + '" class="upload-hidden" accept="image/gif, image/jpeg, image/png" title="파일 첨부">파일첨부</label>' +
							'</div>'
						)
					}
					setTimeout(function() {
						fn.filePicInit();
					}, 100);
				}
			});

			//file upload delete
			// $(document).on('click', '.upload-filepic .upload-display', function(){
			$(document).on('click', '.upload-filepic .btn-delete', function(){
				var $this = $(this),
					$parent = $(this).parent(),
					$parentarea = $(this).closest('.form-filepic'),
					inputName = $parentarea.find('input[type="file"]').attr('name'),
					fileMaxLength = Number($parentarea.attr('data-maxlength')),
					fileCurrentLength = $parentarea.find('.upload-filepic').length,
					display = 0,
					errorbox = this;

				fn.inputErrorClear(errorbox);

				for ( var i = 0 ; i < fileCurrentLength ; i++ ) {
					if ( $parentarea.find('.upload-filepic').eq(i).find('.upload-display').length ) {
						display++;
					}
				}
				if ( fileCurrentLength >= fileMaxLength ) {
					if ( display >= fileMaxLength ) {
						$parent.find('.upload-hidden').val('');
						$this.remove();
						$parent.remove();
						$parentarea.find('.form-filepicupload').prepend(
							'<div class="upload-filepic">' +
								'<label class="btn line">><input type="file" name="' + inputName + '" class="upload-hidden" accept="image/gif, image/jpeg, image/png" title="파일 첨부">파일첨부</label>' +
							'</div>'
						);
					} else {
						$parent.find('.upload-hidden').val('');
						$parent.remove();
					}
				} else {
					$parent.find('.upload-hidden').val('');
					$parent.remove();
				}
				setTimeout(function() {
					fn.filePicInit();
				}, 100);
			});

			//file pic
			$('.upload-filepic img').each(function() {
				var $parent = $(this).closest('.upload-filepic'),
					img_width = $(this).width(),
					img_height = $(this).height();

				if ( img_width > img_height ){
					$parent.addClass('vertical');
				}
			});
		},

		//fileMultiInit
		fileMultiInit : function() {
			$('.form-filemulti').each(function() {
				var $this = $(this);

				console.log($this);
				$this.find('.upload-filemulti').removeClass('last');
				if ( $this.find('.upload-filemulti:last').find('.txt-filename').length <= 0 ){
					$this.find('.upload-filemulti:last').addClass('last');
				}
			});
		},

		//fileMultiUpload
		fileMultiUpload : function() {
			//file upload
			$(document).on('change', '.upload-filemulti .upload-hidden', function(){
				var $this = $(this),
					$parent = $this.parent().parent(),
					$parentarea = $this.closest('.form-filemulti'),
					inputName = $this.attr('name'),
					reader = new FileReader(),
					fileMaxSize = Number($parentarea.attr('data-maxsize')),
					fileCurrentSize = 0,
					fileMaxLength = Number($parentarea.attr('data-maxlength')),
					fileCurrentLength = 0,
					errorbox = this;

				fn.inputErrorClear(errorbox);

				$parentarea.find('input[data-size]').each(function(){
					fileCurrentSize += Number($(this).attr('data-size'));
					fileCurrentLength++;
				});

				if (fileCurrentSize + $this[0].files[0].size > fileMaxSize * 1024 * 1024) {
					fn.inputError(errorbox, '첨부파일 제한용량을 초과하였습니다.' + fileMaxSize + 'MB 이하로 첨부파일을 올려주세요.', 'error');
					$this.removeAttr('data-size');
				} else {
					reader.onloadstart = function(){
						fn.loadingOpen();
					}
					$parent.removeClass('vertical');
					$parent.children('.txt-filename').remove();

					if (!$this[0].files[0].type.match(/image\//)) return;

					reader.onload = function(e){
						var src = e.target.result,
							fileIdx = Number($this.attr('data-value')) || $parent.find('input').length-1,
							fileSize = $this[0].files[0].size,
							fileFullName = $this[0].files[0].name,
							fileLastName = fileFullName.toLowerCase().substring(fileFullName.lastIndexOf('.')+1, fileFullName.length);

						if (!$this.attr('[data-value]')) {
							$this.attr({'data-value':fileIdx, 'data-size':fileSize});
							$parent.append('<p class="txt-filename">' + fileFullName + '<button class="close-btn"><i class="svgicon svgicon-del"></i></button>'+'</p>');
							$parent.find('label').remove() 
						}
					}

					reader.onloadend = function (){
						fn.loadingClose();
					}

					reader.readAsDataURL($(this)[0].files[0]);

					if ( fileCurrentLength+1 < fileMaxLength ){
						$parentarea.find('.form-filemultiupload').prepend(
							'<div class="upload-filemulti">' +
								'<label><input type="file" name="' + inputName + '" class="upload-hidden" accept="image/gif, image/jpeg, image/png" title="파일 첨부"><i class="svgicon svgicon-file"></i>파일첨부</label>' +
							'</div>'
						)
					}
					setTimeout(function() {
						fn.filemultiInit();
					}, 100);
				}
			});

			//file upload delete
			$(document).on('click', '.upload-filemulti .txt-filename button', function(){
				var $this = $(this),
					$parent = $(this).parent().parent(),
					$parentarea = $(this).closest('.form-filemulti'),
					inputName = $parentarea.find('input[type="file"]').attr('name'),
					fileMaxLength = Number($parentarea.attr('data-maxlength')),
					fileCurrentLength = $parentarea.find('.upload-filemulti').length,
					display = 0,
					errorbox = this;

				fn.inputErrorClear(errorbox);

				if ( fileCurrentLength >= fileMaxLength ) {
					if ( display >= fileMaxLength ) {
						$parent.find('.upload-hidden').val('');
						$this.remove();
						$parent.remove();
						$parentarea.find('.form-filemultiupload').prepend(
							'<div class="upload-filemulti">' +
								'<label><input type="file" name="' + inputName + '" class="upload-hidden" accept="image/gif, image/jpeg, image/png" title="파일 첨부"><i class="svgicon svgicon-file"></i>파일첨부</label>' +
							'</div>'
						);
					} else {
						$parent.find('.upload-hidden').val('');
						$parent.remove();
					}
				} else {
					$parent.find('.upload-hidden').val('');
					$parent.remove();
				}
				setTimeout(function() {
					fn.filemultiInit();
				}, 100);
			});
		},
		// loadingOpen
		loadingOpen: () => {
		},

		// loadingClose
		loadingClose: () => {
		},

		accordion: target => {
			let accordions = target ? document.querySelectorAll(target) : document.querySelectorAll('.list-accordion');
	
			accordions.forEach((accordion) => {
					let accordionLis = accordion.querySelectorAll('li');
					let heightAutoAccordion = accordion.classList.contains('customer-detail');
					
					accordionLis.forEach((accordionLi) => {
							if (accordionLi.querySelector('.accordion-ti')) {
									let accordionTi = accordionLi.querySelector('.accordion-ti');
									let accordionBo = accordionLi.querySelector('.accordion-bottom');
									let checkbox = accordionTi.querySelector('input[type="checkbox"]');
	
									const handleAccordionClick = (e) => {
											if (!accordionTi.classList.contains('nonactive')) {
													if (heightAutoAccordion && accordionLi.querySelector('.inner')) {
															let accordionCont = accordionLi.querySelector('.accordion-cont');
															let inner = accordionCont.querySelector('.inner');
	
															if (inner && accordionCont) {
																	if (accordionLi.classList.contains('active')) {
																			accordionCont.style.maxHeight = '0';
																	} else {
																			accordionCont.style.maxHeight = `${inner.clientHeight}px`;
																	}
															}
													}
													fn.toggleActive(accordionLi);
											}
											e.stopPropagation();
									};
	
									accordionTi.addEventListener('click', handleAccordionClick);
	
									if (accordionBo) {
											accordionBo.addEventListener('click', handleAccordionClick);
									}
	
									if (checkbox) {
											checkbox.addEventListener('change', (e) => {
													if (checkbox.checked) {
															fn.addActive(accordionLi);
															if (heightAutoAccordion && accordionLi.querySelector('.inner')) {
																	let accordionCont = accordionLi.querySelector('.accordion-cont');
																	let inner = accordionCont.querySelector('.inner');
																	if (inner && accordionCont) {
																			accordionCont.style.maxHeight = `${inner.clientHeight}px`;
																	}
															}
													} else {
															fn.removeActive(accordionLi);
															if (heightAutoAccordion && accordionLi.querySelector('.inner')) {
																	let accordionCont = accordionLi.querySelector('.accordion-cont');
																	if (accordionCont) {
																			accordionCont.style.maxHeight = '0';
																	}
															}
													}
											});
									}
							}
					});
			});
	},
	
	// accordion toggle
	accordionToggle: (target, toggle) => {
			const
					accordion = fn.objTypeCheck(target),
					state = toggle;
	
			let accordionLis = accordion.querySelectorAll('li');
			accordionLis.forEach((accordionLi) => {
					if (accordionLi.querySelector('.accordion-ti')) {
							let accordionTi = accordionLi.querySelector('.accordion-ti');
							if (!accordionTi.classList.contains('nonactive')) {
									if (state == 'toggle') {
											accordionLi.classList.contains('active') ? fn.removeActive(accordionLi) : fn.addActive(accordionLi);
									} else if (state == 'open') {
											fn.addActive(accordionLi);
									} else {
											fn.removeActive(accordionLi);
									}
							}
					}
			});
	},

		// tabMenu
		tabMenu: target => {
			let tabmenus = target ? document.querySelectorAll(target) : document.querySelectorAll('.tabmenu');

			tabmenus.forEach((tabmenu) => {
				let
					tabTiLinks = tabmenu.querySelectorAll('.tab-ti a'),
					tabConts = tabmenu.querySelectorAll('.tab-contents'),
					isSwiper = tabmenu.querySelector('.tab-ti').classList.contains('slide');

				if (isSwiper) {
					let tabSlide = tabmenu.querySelector('.swiper');
					let tabSwiper = new Swiper(tabSlide, {
						slidesPerView: 'auto',
						watchOverflow: true,
						slidesOffsetBefore: 0,
						slidesOffsetAfter: 0,
					});
				}

				tabTiLinks.forEach((tabtilink) => {
					let tabCont = fn.objTypeCheck(tabtilink.getAttribute('href'));

					tabtilink.addEventListener('click', (e) => {
						for (let i = 0; i < tabTiLinks.length; i++) {
							fn.removeActive(tabTiLinks[i]);
							fn.removeActive(tabConts[i]);
						}
						if (tabCont != '#' && tabCont != 'javascript:;') {
							fn.addActive(tabtilink);
							fn.addActive(tabCont);
							e.preventDefault();
						}
					});
				});
			});
		},

		// scroll 고정
		scroll: (state, top) => {
			let
				scrolltNow = top,
				wrap = document.querySelector('body');

			switch(state) {
				case 'disabled':
					wrap.style.top = -scrolltNow + 'px';
					wrap.classList.add('fixed');
					break;

				case 'enabled':
					wrap.style.top = '0';
					wrap.classList.remove('fixed');
					scrollt = 0;
					window.scrollTo({top: scrolltNow});
					break;
			}
		},

		// popup open close
		popup: (state, target) => {
			if (typeof target === 'object') {
				target = target.closest('[class*=popup]') ? '#'+target.closest('[class*=popup]').id : target.attributes.href.value;
			} else if (typeof target === 'undefined') {
				target = '#'+document.querySelector(':focus').closest('[class*=popup]').id;
			}

			let
				wrap = document.querySelector('body'),
				popup = document.querySelector(target),
				popupEnd = document.querySelector(target+'_end'),
				popupLength = 0,
				popupZindex = 999;

			switch(state) {
				case 'open':
					if (!wrap.classList.contains('fixed')) {
						scrollt = window.scrollY;
						fn.scroll('disabled', scrollt);
					}

					popup.classList.add('active');
					popup.setAttribute('tabindex','0');

					popupLength = document.querySelectorAll('[class*=popup][class*=active]').length;

					if (popupLength > 1) {
						document.querySelectorAll('[class*=popup][class*=active]').forEach(function(popup) {
							popup.classList.add('dimdisabled');
						});
					}

					popup.style.zIndex = popupZindex + popupLength;
					popup.setAttribute('data-popupzIndex', popupZindex + popupLength);
					popup.classList.remove('dimdisabled');

					if (document.querySelector(':focus')) {
						document.querySelector(':focus').setAttribute('data-popupLength', popupLength);
					}

					popup.focus();
					popupEnd.setAttribute('tabindex','0');
					popupEnd.addEventListener('focus', () => {
						popup.focus();
					});
					break;

				case 'close':
					popupLength = document.querySelectorAll('[class*=popup][class*=active]').length;

					popup.classList.remove('active');
					popup.removeAttribute('tabindex');
					popup.removeAttribute('data-popupzIndex');
					popupEnd.removeAttribute('tabindex');

					if (popupLength <= 1) {
						fn.scroll('enabled', scrollt);
					} else {
						if (popupZindex + popupLength - 1) {
							document.querySelector('[data-popupzIndex="'+(popupZindex + popupLength - 1)+'"]').classList.remove('dimdisabled');
						}
					}

					if (document.querySelector('[data-popupLength="'+popupLength+'"]')) {
						document.querySelector('[data-popupLength="'+popupLength+'"]').focus();
						document.querySelector('[data-popupLength="'+popupLength+'"]').removeAttribute('data-popupLength');
					}
					break;
			}
		},

		// popup filter
		popupFilter: (state, target, tab) => {
			if (typeof target === 'object') {
				target = target.closest('[class*=popup]') ? '#'+target.closest('[class*=popup]').id : target.attributes.href.value;
			} else if (typeof target === 'undefined') {
				target = '#'+document.querySelector(':focus').closest('[class*=popup]').id;
			}

			let
				wrap = document.querySelector('body'),
				popup = document.querySelector(target),
				popupEnd = document.querySelector(target+'_end'),
				popupLength = 0,
				popupZindex = 999;

			// 회원권 추천의 필터 탭으로 추가
			if (tab) {
				popup.setAttribute('data-tab', tab);
			}

			switch(state) {
				case 'open':
					if (!wrap.classList.contains('fixed')) {
						scrollt = window.scrollY;
						fn.scroll('disabled', scrollt);
					}

					popup.classList.add('active');
					popup.setAttribute('tabindex','0');

					popupLength = document.querySelectorAll('[class*=popup][class*=active]').length;

					if (popupLength > 1) {
						document.querySelectorAll('[class*=popup][class*=active]').forEach(function(popup) {
							popup.classList.add('dimdisabled');
						});
					}

					popup.style.zIndex = popupZindex + popupLength;
					popup.setAttribute('data-popupzIndex', popupZindex + popupLength);
					popup.classList.remove('dimdisabled');

					if (document.querySelector(':focus')) {
						document.querySelector(':focus').setAttribute('data-popupLength', popupLength);
					}

					popup.focus();
					popupEnd.setAttribute('tabindex','0');
					popupEnd.addEventListener('focus', () => {
						popup.focus();
					});

					// 회원권 추천의 필터 탭으로 추가
					const tabEvent = new CustomEvent('popup-open-tab', { detail: { tab } });
					popup.dispatchEvent(tabEvent);

					break;

				case 'close':
					popupLength = document.querySelectorAll('[class*=popup][class*=active]').length;

					popup.classList.remove('active');
					popup.removeAttribute('tabindex');
					popup.removeAttribute('data-popupzIndex');
					popupEnd.removeAttribute('tabindex');

					if (popupLength <= 1) {
						fn.scroll('enabled', scrollt);
					} else {
						if (popupZindex + popupLength - 1) {
							document.querySelector('[data-popupzIndex="'+(popupZindex + popupLength - 1)+'"]').classList.remove('dimdisabled');
						}
					}

					if (document.querySelector('[data-popupLength="'+popupLength+'"]')) {
						document.querySelector('[data-popupLength="'+popupLength+'"]').focus();
						document.querySelector('[data-popupLength="'+popupLength+'"]').removeAttribute('data-popupLength');
					}
					break;
			}
		},

		// textarea
		wordLimit: (target, limit) => {
			const
				targetEl = target,
				wordLength = targetEl.value.length,
				currentNumberEl = targetEl.nextElementSibling.querySelector('span'),
				limitNumber = limit;

			targetEl.setAttribute('maxlength', limitNumber);

			if (wordLength <= limitNumber) {
				currentNumberEl.textContent = wordLength.toLocaleString();
			}
		},

		// tooltip
		tooltip: () => {
			const tooltipBtns = document.querySelectorAll('.tooltip-wrap .btn-tooltip');

			tooltipBtns.forEach((tooltipBtn) => {
				const
					toolTipWrap = tooltipBtn.closest('.tooltip-wrap'),
					closeBtn = toolTipWrap.querySelector('.btn-close'),
					toolTip = toolTipWrap.querySelector('.tooltip');

				tooltipBtn.addEventListener('click', () => {
					if(toolTip.style.display !== 'block') {
						toolTip.style.display = 'block';
						toolTip.setAttribute('tabindex', 0);
					}
				});

				closeBtn.addEventListener('click', () => {
					toolTip.style.display = 'none';
					toolTip.removeAttribute('tabindex');
					tooltipBtn.focus();
				});
			});
		},

		// cookie
		setCookie: (name, value, expiredays) => {
			let todayDate = new Date();
			todayDate.setDate(todayDate.getDate() + expiredays);
			document.cookie = name + '=' + escape(value) + '; path=/; expires=' + todayDate.toGMTString() + ';'
		},

		getCookie: (name) => {
			let
				from_idx = document.cookie.indexOf(name+'='),
				to_idx;
			if (from_idx != -1) {
				from_idx += name.length + 1;
				to_idx = document.cookie.indexOf(';', from_idx);

				if (to_idx == -1) {
					to_idx = document.cookie.length;
				}
				return unescape(document.cookie.substring(from_idx, to_idx));
			}
		},

		cookiePopupClose: (target, cookieidx, inputName) => {
			if ($('.popup input:checkbox[name=' + inputName + ']').is(':checked') == true) {
				fn.setCookie(cookieidx, 'no' , 1);
			}

			fn.popup('close', target);
		},

		// 수량 증가
		optionEaUp: target => {
			let $target = fn.objTypeCheck(target);
			const $targetPrev = $target.previousElementSibling;

			let	
				eaVal = parseInt($targetPrev.value),
				max = parseInt($targetPrev.getAttribute('max')) || 0;

				if ( max ) {
					if ( eaVal < max ) {
						eaVal++;
					}
				} else {
					eaVal++;
				}

				$targetPrev.value = eaVal;

			// 수량 자릿수 제한
			fn.optionEaLength($targetPrev);
		},

		// 수량 감소
		optionEaDown: target => {
			let $target = fn.objTypeCheck(target);
			const $targetNext = $target.nextElementSibling;

			let 
				eaVal = parseInt($targetNext.value),
				min = parseInt($targetNext.getAttribute('min')) || 0;

			if ( min ) {
				if ( eaVal > min ) {
					eaVal--;
				}
			} else {
				eaVal--;
			}

			$targetNext.value = eaVal;
		},

		// 수량 자릿수 제한
		optionEaLength: target => {
			const eaLength = obj => {
				if (obj.value.length > obj.maxLength) {
					obj.value = obj.value.slice(0, obj.maxLength);
				}
			}

			if (typeof target === 'string' && target.indexOf(',') !== -1) {
				target = target.split(',');
				target.forEach(element => eaLength(document.querySelector(element)));
			} else {
				eaLength(fn.objTypeCheck(target));
			}
		},

		// inputError
		inputError: (target, msg, type) => {
			const
				className = type ? 'positive' : 'error',
				$form = fn.objTypeCheck(target).closest('.form-entry');

			$form.classList.add(className);

			if (msg) {
				const	$inputError = document.createElement('p');

				$inputError.classList.add('inputmsg');
				$inputError.innerHTML = msg;
				$form.append($inputError);
			}
		},

		// inputErrorClear
		inputErrorClear: target => {
			const clearMessage = obj => {
				const $form = obj.closest('.form-entry');
				$form.classList.remove('error', 'positive');

				if ($form.querySelector('.inputmsg')) {
					const $inputError = $form.querySelector('.inputmsg');
					$inputError.remove();
				}
			}

			if (target) {
				if (typeof target == 'string' && target.indexOf(',') !== -1) {
					target.split(',').forEach(element => clearMessage(document.querySelector(element)));
				} else {
					clearMessage(fn.objTypeCheck(target));
				}
			} else {
				const $form = document.querySelectorAll('.form-entry');

				$form.forEach(item => item.classList.remove('error', 'positive'));

				if (document.querySelectorAll('.inputmsg').length) {
					const $inputError = document.querySelectorAll('.inputmsg');

					$inputError.forEach(item => item.remove());
				}
			}
		},

		// 로그인 연장
		logoutTimer: (target, state) => {
			if (state === 'reset') {
				clearInterval(logoutInterval);
				fn.objTypeCheck(target).innerText = '30';

				return;
			}

			let sec = 30;
			fn.objTypeCheck(target).innerText = sec;

			clearInterval(logoutInterval);
			logoutInterval = setInterval(() => {

				sec > 0 ? sec-- : sec;
				fn.objTypeCheck(target).innerText = sec < 10 ? '0' + sec : sec;

				if (sec === 0) clearInterval(logoutInterval);
			}, 1000);
		},

		//인증번호 유효시간
		certificationTimer: function (time, obj, btn) {
			var minute = Number(time.split(':')[0]),
				second = Number(time.split(':')[1]),
				$btn = $(btn);

			second = minute * 60 + (second - 1);
			clearInterval(cTimeInterval);
			time = function () {
				if (second % 60 < 10) {
					return [parseInt(second / 60), ':0', second % 60].join('');
				} else {
					return [parseInt(second / 60), ':', second % 60].join('');
				}
			};
			$(obj).text(time);
			$(obj).parent().addClass('active');
			$btn.attr('disabled', true);
			$('.form-entry .btn-certiconfirm').attr('disabled', false);
			cTimeInterval = setInterval(function () {
				if (second > 0) {
					second--;
					$(obj).text(time);
				} else {
					clearInterval(cTimeInterval);
					$btn.attr('disabled', false).text('재발송');
					$('.certitimer').html('');
					$('.form-entry .btn-certiconfirm').attr('disabled', true);
				}
			}, 1000);
		},

		//인증번호 clear
		certificationTimerClear: function (obj) {
			$('.certitimer').html('');
			// $('.certitimer').parent().removeClass('active')
			clearInterval(cTimeInterval);
			$(obj).attr('disabled', false).text('재발송');
			$('.certitimer').html('');
			$('.form-entry .btn-certiconfirm').attr('disabled', true);
		},

		// 비밀번호 보기
		passwordPreview: target => {
			const btn = fn.objTypeCheck(target);
			const input = btn.previousElementSibling;
			const type = input.getAttribute('type');

			if (type === 'password') {
				input.setAttribute('type', 'text');
			} else {
				input.setAttribute('type', 'password');
			}

			btn.querySelector('.svgicon').classList.toggle('svgicon-previewon');
		},

		// chart gradient
		getGradient: (canvas, color1, color2) => {
			const gradient = canvas.getContext("2d").createLinearGradient(0, 0, 400, 400);

			gradient.addColorStop(0, color1);
			gradient.addColorStop(1, color2);

			return gradient;
		},

		// doughnut chart
		doughnutChart: (target, color) => {
			let ctx = fn.objTypeCheck(target).querySelector('canvas');
			let full = $(target).hasClass('full-chart');
		
			let chartValue = fn.objTypeCheck(target).querySelector('.txt-percentage > em').textContent;

			if (chartValue == 0) {
				fn.objTypeCheck(target).classList.add('chart-nodata');
				color = full ? color : '#596584' // nodata color;
			}

			if (chartValue < 5 && !full) {
				const circle = document.createElement('span');
				circle.classList.add('circle');
				circle.style.backgroundColor = color;
				fn.objTypeCheck(target).append(circle);
			}

			const ShadowPlugin = {
				beforeDraw: (chart) => {
					const { ctx } = chart;

					ctx.shadowColor = full ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.2)";
					ctx.shadowBlur = 10;
					ctx.shadowOffsetX = full ? 3 : 5;
					ctx.shadowOffsetY = full ? 6 : 5;
				},
			};

			const CirclePlugin = {
				afterDatasetDraw: (chart) => {
					const { ctx, chartArea } = chart;

					const meta = chart.getDatasetMeta(0);
					const arc = meta.data[0]; 
					if (!arc) return;

					const endAngle = arc.endAngle;
					const angle = endAngle - 0.05;

					const centerX = (chartArea.left + chartArea.right) / 2;
					const centerY = full ? (chartArea.top + chartArea.bottom) / 2 : chartArea.bottom - 28;

					const radius = (arc.outerRadius + arc.innerRadius) / 2; 

					const circleX = centerX + radius * Math.cos(angle);
					const circleY = centerY + radius * Math.sin(angle);

					const size = full ? 5 : 4;

					ctx.save();
					ctx.beginPath();
					ctx.arc(circleX, circleY, size, 0, Math.PI * 2);
					ctx.fillStyle = color; 
					ctx.fill();
					ctx.restore();
				},
			};

			function hexToRgb(hex, alpha) {
				let r = parseInt(hex.slice(1, 3), 16),
					g = parseInt(hex.slice(3, 5), 16),
					b = parseInt(hex.slice(5, 7), 16);
				
				if (0 <= alpha && alpha <= 1) {
					return `rgba(${r}, ${g}, ${b}, ${alpha})`
				} else {
					return `rgb(${r}, ${g}, ${b})`
				}
			}

			chartValue = chartValue > 100 ? 100 : chartValue;

			let pluginsOptions = chartValue < 5 ? (full ? [ShadowPlugin, CirclePlugin] : [ShadowPlugin]) : (chartValue < 100 ? [ShadowPlugin, CirclePlugin] : [CirclePlugin]);

			new Chart(ctx, {
				type: 'doughnut',
				data: {
					datasets: [{
						data: [chartValue, (100 - chartValue)],
						backgroundColor: [
							hexToRgb(color, 0.9),
							'transparent'
						],
						borderWidth: 0,
						borderRadius: 50,
						width: full ? 120 : 152,
						height: full ? 120 : 76,
					}]
				},
				options: {
					cutout: full ? '80%' : '87%',
					rotation: full ? 0 : -90,
					circumference: full ? 360 : 180,
					animation: {},
					layout: {
						padding: {
							left: 10,
							right: 10,
							top: 10,
							bottom: 10,
						}
					}
				},
				plugins: pluginsOptions,
			});
		},

		// barline chart
		barLineChart(target, data, labels, stepSize, id) {
			let ctx = fn.objTypeCheck(target).querySelector('canvas').getContext('2d');

			var chartData = {
				labels: labels,
				datasets: []
			};

			// 데이터 세트를 동적으로 추가
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					chartData.datasets.push({
						label: data[key].label,
						type: data[key].type,
						backgroundColor: data[key].backgroundColor || '#4AAE78',
						borderColor: data[key].borderColor || '#4AAE78',
						pointColor: data[key].pointColor || '#4AAE78',
						borderRadius: data[key].borderRadius || 4,
						barThickness: data[key].barThickness || 31,
						data: data[key].data
					});
				}
			}

			const getOrCreateLegendList = (chart, id) => {
				const legendContainer = document.getElementById(id);
				let listContainer = legendContainer.querySelector('div');
			
				if (!listContainer) {
					listContainer = document.createElement('div');

					legendContainer.appendChild(listContainer);
				}
			
				return listContainer;
			};
			
			const htmlLegendPlugin = {
				id: 'htmlLegend',
			
				afterUpdate(chart, args, options) {
					const ul = getOrCreateLegendList(chart, options.containerID);
			
					while (ul.firstChild) {
						ul.firstChild.remove();
					}
					const items = chart.options.plugins.legend.labels.generateLabels(chart);
			
					items.forEach(item => {
						const li = document.createElement('p');
			
						li.onclick = () => {
							const {type} = chart.config;
							if (type === 'pie' || type === 'doughnut') {
								chart.toggleDataVisibility(item.index);
							} else {
								chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
							}
							chart.update();
						};
			
						// Color box
						const boxSpan = document.createElement('span');
						const datasetType = chart.data.datasets[item.datasetIndex].type;
						const typeColor = chart.data.datasets[item.datasetIndex].backgroundColor;
						if (datasetType === 'line') {
							boxSpan.className = 'cumulative';

							for (let i = 0; i < 3; i++) {
								const innerSpan = document.createElement('span');
								innerSpan.style.backgroundColor = typeColor;
								innerSpan.className = `inner-span-${i + 1}`;
								boxSpan.appendChild(innerSpan);
							}
				
						} else {
							boxSpan.className = 'bymonth';
							boxSpan.style.backgroundColor = typeColor;
						}

		
						const text = document.createTextNode(item.text);
						li.appendChild(boxSpan);
						li.appendChild(text);
						ul.appendChild(li);
					});
				}
			};
			new Chart(ctx, {
				type: 'bar', // 기본 차트 타입을 지정합니다.
				data: chartData,
				options: {
					responsive: false,
					scales: {
						y: {
							ticks: {
								beginAtZero: true,
								stepSize: stepSize,
								color: "#596584",
								font: {
									family: "Pretendard",
									size: 12,
									weight: 500,
									align: 'left'
								}
							},
							grid: {
								color: 'rgba(230, 233, 242, 1)',
							}
						},
						x: {
							ticks: {
								maxTicksLimit: 0,
								color: "#091B4D",
								font: {
									family: "Pretendard",
									size: 14,
									weight: 500,
								}
							},
						}
					},
					plugins: {
						legend: {
							display: false,
						},
						htmlLegend: {
							containerID: id,
						},
						title: {
							display: false,
						},
						beforeInit: function (chart) {
							chart.data.labels.forEach(function (label, index, labelsArr) {
								if (/\n/.test(label)) {
									labelsArr[index] = label.split(/\n/)
								}
							})
						}
					}
				},
				plugins: [htmlLegendPlugin],
			});
		},

		// filldoughnut chart
		filldoughnutChart(target, data, id) {
			let ctx = fn.objTypeCheck(target).querySelector('canvas').getContext('2d');
		
			var chartData = {
				labels: [],
				datasets: [{
					data: [],
					backgroundColor: []
				}]
			};
		
			// 데이터 세트를 동적으로 추가
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					chartData.labels.push(data[key].label);
					chartData.datasets[0].data.push(data[key].data);
					chartData.datasets[0].backgroundColor.push(data[key].backgroundColor);
				}
			}
		
			const getOrCreateLegendList = (chart, id) => {
				const legendContainer = document.getElementById(id);
				let listContainer = legendContainer.querySelector('div');
		
				if (!listContainer) {
					listContainer = document.createElement('div');
					legendContainer.appendChild(listContainer);
				}
		
				return listContainer;
			};
		
			const htmlLegendPlugin = {
				id: 'htmlLegend',
		
				afterUpdate(chart, args, options) {
					const ul = getOrCreateLegendList(chart, options.containerID);
		
					while (ul.firstChild) {
						ul.firstChild.remove();
					}
					const items = chart.options.plugins.legend.labels.generateLabels(chart);
		
					items.forEach(item => {
						const li = document.createElement('p');
		
						li.onclick = () => {
							const {type} = chart.config;
							if (type === 'pie' || type === 'doughnut') {
								chart.toggleDataVisibility(item.index);
							} else {
								chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
							}
							chart.update();
						};
		
						// Color box
						const boxSpan = document.createElement('span');
						const typeColor = chart.data.datasets[0].backgroundColor[item.index]; // 수정된 부분
						console.log('typeColor: ', typeColor);
						boxSpan.className = 'label'; // 고정된 클래스 이름 설정
						boxSpan.style.backgroundColor = typeColor;

						const text = document.createTextNode(item.text);
						li.appendChild(boxSpan);
						li.appendChild(text);
						ul.appendChild(li);
					});
				}
			};
		
			new Chart(ctx, {
				type: 'doughnut',
				data: chartData,
				options: {
					responsive: false,
					plugins: {
						legend: {
							display: false,
							position: 'right',
						},
						htmlLegend: {
							containerID: id,
						},
						title: {
							display: false,
						}
					}
				},
				plugins: [htmlLegendPlugin],
			});
		},


		// form range
		formRange: (target) => {
			const range = target.closest('.form-range');
			const ranges = document.querySelectorAll('.form-range');

			if (range.classList.contains('disabled')) return;

			range.classList.contains('active') ? range.classList.remove('active') : range.classList.add('active')

			ranges.forEach(rg => {
				if (rg !== range) {
					rg.classList.contains('active') && rg.classList.remove('active');
				}
			})

			window.addEventListener('click', (e) => {
				let ranges = document.querySelectorAll('.form-range');
				if (e.target.closest('.form-range') === null) {
					ranges.forEach((range) => {
						range.classList.remove('active');
					});
				}
				e.stopPropagation();
			});
		},

		timePickerInit: (startinput, endinput, state) => {
			let
				start,
				end,
				startTxt = $('#popupTimePicker .start-time .time'),
				endTxt = $('#popupTimePicker .end-time .time');
			if (state !== 'load') {
				start = document.querySelector(startinput),
				end = document.querySelector(endinput);

				start.value = '';
				end.value = '';
				startTxt.text('09:00');
				endTxt.text('09:30');

				starthourswiper.update();
				endhourswiper.update();
				starthourswiper.slideTo(18);
				endhourswiper.slideTo(18);

				$('#popupTimePicker .regist-btn').on('click', function() {
					$(startinput).val(startTxt.text());
					$(endinput).val(endTxt.text());
				});
			} else {
				starthourswiper = new Swiper('#popupTimePicker .startswiper .swiper', {
					direction: 'vertical',
					slidesPerView: 'auto',
					centeredSlides: true,
					initialSlide: 18,
				});

				endhourswiper = new Swiper('#popupTimePicker .endswiper .swiper', {
					direction: 'vertical',
					slidesPerView: 'auto',
					centeredSlides: true,
					initialSlide: 18,
				});

				starthourswiper.on('slideChangeTransitionStart', function() {
					var activeIndex = this.activeIndex;
							this.slides.removeClass('active');
							this.slides.eq(activeIndex).addClass('active');
							startTxt.text(this.slides.eq(activeIndex).text());
							if (endhourswiper.activeIndex < starthourswiper.activeIndex) {
								endhourswiper.slideTo(starthourswiper.activeIndex);
							}
				})

				endhourswiper.on('slideChangeTransitionStart', function() {
					var activeIndex = this.activeIndex;
							this.slides.removeClass('active');
							this.slides.eq(activeIndex).addClass('active');
							endTxt.text(this.slides.eq(activeIndex).text());
							if (starthourswiper.activeIndex > endhourswiper.activeIndex) {
								starthourswiper.slideTo(endhourswiper.activeIndex);
							}
				})
			}
		},

		toastPopup: (target) => {
			fn.objTypeCheck(target).classList.add('active');
			setTimeout(() => {
				fn.objTypeCheck(target).classList.remove('active');
				fn.objTypeCheck(target).classList.add('out');

				setTimeout(() => {
					fn.objTypeCheck(target).classList.remove('out');
				}, 400);
			}, 2000);
		},

		graphSwiper: () => {
			if (graphswiper) graphswiper.destroy();

			graphswiper = new Swiper('.graph-swiper .swiper', {
				slidesPerView: 'auto',
				spaceBetween: 40,
				navigation: {
					nextEl: '.graph-swiper .swiper-button-next',
					prevEl: '.graph-swiper .swiper-button-prev',
				},
				on: {
					init: () => {
						document.querySelector('.graph-swiper').classList.add('active');
					},
				},
			})
		},

		//loading open
		loadingOpen: function (obj) {
			var $obj = $(obj);
			$('.loading-area').remove();
			var loadhtml = '<div class="loading-area"><div class="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
			if ($obj.length > 0) {
				$obj.after(loadhtml);
				$('.loading-area').addClass('cont');
			} else {
				$('#wrap').append(loadhtml);
			}
			$('.loading-area').fadeIn(400);
		},

		//loadding close
		loadingClose: function () {
			$('.loading-area').fadeOut(400, function () {
				$('.loading-area').remove();
			});
		},

		viewTabSwipers: () => {
			if (viewTabSwiper) viewTabSwiper.destroy();

			viewTabSwiper = new Swiper('.view-tab .swiper', {
				slidesPerView: 'auto',
				observer: true,
				observeParents: true,
				navigation: {
					nextEl: '.view-tab .swiper-button-next',
					prevEl: '.view-tab .swiper-button-prev',
				},
			});
		},

		viewLayoutSwipers: () => {
			if (viewLayoutSwiper) viewLayoutSwiper.destroy();

			viewLayoutSwiper = new Swiper('.viewlayout-swiper > .swiper', {
				autoHeight: true,
				speed: 600,
				thumbs: {
					swiper: viewTabSwiper,
				},
				on: {
					slideChangeTransitionStart: () => {
						const activeIndex = viewLayoutSwiper.activeIndex;

						if (viewSwiper[activeIndex]) viewSwiper[activeIndex].slideTo(0, 0);

						if (viewTabSwiper) {
							viewTabSwiper.slides.forEach(slide => slide.querySelector('.btn-tab').classList.remove('active'))
							viewTabSwiper.slides[activeIndex].querySelector('.btn-tab').classList.add('active')
						}
					},

					slideChangeTransitionEnd: () => {
						// const activeIndex = viewLayoutSwiper.activeIndex;
						// const tabConts = Array.from(document.querySelectorAll('.viewlayout-swiper .view-contents'));

						// tabConts.forEach(cont => cont.classList.remove('active'));
						// tabConts[activeIndex].classList.add('active');
						window.scrollTo(0, 0);
					},
				}
			});
		},

		viewSwipers: () => {
			if (viewSwiper.length) {
				for (let i=0; i<viewSwiper.length; i++) {
					viewSwiper[i].destroy();
				}

				viewSwiper = [];
			}

			const viewSwiperAll = document.querySelectorAll('.viewlayout-swiper .view-swiper');

			viewSwiperAll.forEach((swiper, i) => {
				viewSwiper[i] = new Swiper(swiper.querySelector('.view-swiper .swiper'), {
					preloadImages: false,
					lazy: {
						loadPrevNext: true,
					},
					direction: 'vertical',
					observer: true,
					observeParents: true,
					mousewheel: true,
					speed: 600,
					on : {
						slideChangeTransitionEnd: () => {
							const activeIndex = viewSwiper[i].activeIndex;
							if (activeIndex === viewSwiper[i].slides.length - 1) {
								$('.view-area').addClass('end')
							} else {
								$('.view-area').removeClass('end')
							}
						},
					}
				});
			});

			if (document.querySelectorAll('.view-tab .swiper .swiper-slide').length) {
				const tabSlides = document.querySelectorAll('.view-tab .swiper .swiper-slide');

				tabSlides.forEach((tab, index) => {
					const btn = tab.querySelector('.btn-tab');

					btn.addEventListener('click', () => {
						viewLayoutSwiper.slideTo(index, 600);

						for (let i=0; i<viewTabSwiper.length; i++) {
							tabSlides[i].querySelector('.btn-tab').classList.remove('active');
						}

						btn.classList.add('active');
					});
				})
			}
		},
		
		formatMobile: (target, value) => {
		     if (!value) return ''; // value가 없을 경우 빈 문자열 반환

		     value = value.replace(/[^0-9]/g, ''); // 숫자만 남김
		     console.log(value);
		     
		     let size = value.length;
		     let regEx1 = null,
		         regEx2 = null;
		     
		     console.log("size : ", size);
		     
		     if (size < 8) {
		         regEx1 = /^([0-9]{3})([0-9]{1,4})/;
		     } else if (size < 11) {
		         regEx2 = /^([0-9]{3})([0-9]{3})([0-9]{1,4})/;
		     } else {
		         regEx2 = /^([0-9]{3})([0-9]{4})([0-9]{1,4})/;
		     }
		     if (size > 11) value = value.substr(0, 11);
		     
		     if (regEx1) {
		         value = value.replace(regEx1, '$1-$2');
		     } else if (regEx2) {
		         value = value.replace(regEx2, '$1-$2-$3');
		     }
		     
		     const targetElement = document.getElementById(target);
		     if (targetElement) {
		         targetElement.value = value; // value 속성에 값 할당
		     }
		    
		},
		openWindow: (url, name, width, height) => {
  
			let left = Math.ceil((window.innerWidth - width) / 2) + window.screenLeft
			let top = Math.ceil((window.innerHeight - height) / 2) + window.screenTop
		

			window.open(url,name,"width="+width+",height="+height+", left="+left+", top="+top+", toolbars=no, resizable=no, scrollbars=no");
		},
	}
})();