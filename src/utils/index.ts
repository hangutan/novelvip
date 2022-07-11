import moment from 'moment';
import 'moment/locale/vi';

export const getSafely = (fn, defaultValue = '') => {
	try {
		return fn();
	} catch (e) {
		return defaultValue;
	}
};

export const random = (number, type = 'text') => {
	try {
		let text = '';
		const possible = type === 'number' ? '0123456789' : 'abcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < number; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	} catch (error) {
		return number;
	}
};

export const getCookie = (cname) => {
	const name = `${cname}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length + 1, c.length - 1);
		}
	}
	return '';
};

export const formatNumber = (number) =>
	new Intl.NumberFormat('en', {
		style: 'decimal',
	}).format(number);

export const timeAgo = (num: number, lang = 'vi') => {
	let time;
	if (!Number.isNaN(num)) {
		time = moment.unix(num).format();
	}
	const timeOut = moment(time).locale(lang).fromNow();
	return timeOut;
};

export const getTimeNowStamp = (time: number = null) => {
	if (time) {
		return moment(time).unix();
	}
	return moment().unix();
};

export const getDate = (time: number = null) => (time ? moment.unix(time).format('DD/MM/YYYY') : '');

export const getTime = (time: number = null) => (time ? moment.unix(time).format('HH:mm:ss') : '');

export const copyTextToClipboard = (text) => {
	if (!document) return false;
	const textArea = document.createElement('textarea');
	textArea.style.position = 'fixed';
	textArea.style.top = '-100px';
	textArea.style.left = '-100px';
	textArea.style.width = '10px';
	textArea.style.height = '10px';
	textArea.style.padding = '10px';
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	const result = document.execCommand('copy');
	document.body.removeChild(textArea);
	return result;
};

export const buildLinkUrl = (host: string, link: string): string => {
	try {
		if (link.indexOf('https://') > -1 || link.indexOf('http://') > -1 || link.indexOf('data:image') > -1) {
			return link;
		}

		return host + link;
	} catch (error) {
		return 'Has error';
	}
};

export type TranslateType = (str: string, obj?: { text?: string; ns?: string }) => string;

export const translateFunc: TranslateType = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v);

export const timeWatch = (id = 'time-watch', cb, translate = translateFunc) => {
	const nextMns = 10;
	const begin = new Date().getTime();
	const countDownDate = new Date(begin + nextMns * 60 * 1000).getTime();

	const x = setInterval(() => {
		const now = new Date().getTime();
		const distance = countDownDate - now;
		// const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		// const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		if (document.getElementById(id)) {
			document.getElementById(id).innerHTML = `${translate('Reload in', { ns: 'common' })}: 
			${minutes} ${translate('minute', { ns: 'common' })} ${seconds} ${translate('second', { ns: 'common' })} `;
		} else {
			clearInterval(x);

			return false;
		}

		// If the count down is finished, write some text
		if (distance < 0) {
			clearInterval(x);

			if (document.getElementById(id)) {
				document.getElementById(id).innerHTML = `${translate('Looking for jobs')}...`;
			}

			if (typeof cb === 'function') {
				cb(id, cb, translate);
			}
		}
	}, 1000);

	return x;
};

export const toggleCollapse = (element, type = 'toggle', isAnimate = true) => {
	const container = document.querySelector(element);
	if (!container) {
		console.log('ERROR: Container', container);
		return;
	}

	const ariaHidden = container.getAttribute('aria-hidden');
	if (!ariaHidden) {
		console.log('ERROR: Attribute aria-hidden', ariaHidden);
		return;
	}

	container.style.overflow = 'hidden';
	if (isAnimate) container.style.transition = 'height 500ms';
	else container.style.transition = 'none';

	const content = container?.children[0];
	if (!content) {
		console.log('ERROR: Collapse children', content);
		return;
	}

	const stylesEl = window.getComputedStyle(content);
	const margin = parseFloat(stylesEl?.marginTop) + parseFloat(stylesEl?.marginBottom);
	const contentHeight = content?.getBoundingClientRect().height + margin;

	const openCollapse = () => {
		container.style.height = '0px';
		setTimeout(() => {
			container.style.height = `${contentHeight}px`;
			container.setAttribute('aria-hidden', 'false');
		}, 1);
	};

	const closeCollapse = () => {
		container.style.height = `${contentHeight}px`;
		setTimeout(() => {
			container.style.height = '0px';
			container.setAttribute('aria-hidden', 'true');
		}, 1);
	};

	if (type === 'init') {
		if (ariaHidden === 'true') {
			container.style.height = '0px';
			container.style.overflow = 'hidden';
		}
		if (ariaHidden === 'false') {
			container.style.height = 'auto';
			container.style.overflow = 'initial';
		}
	} else if (type === 'open') {
		openCollapse();
	} else if (type === 'close') {
		closeCollapse();
	} else {
		if (ariaHidden === 'true') {
			openCollapse();
		}
		if (ariaHidden === 'false') {
			closeCollapse();
		}
	}
};
