const spinner = document.querySelector('.spinner-container');
const container = document.querySelector('#characters');
const buttons = [...document.querySelectorAll('.page-characters')];
const prevAndNext = [...document.querySelectorAll('.letters')];
const inputSearch = document.querySelector('.form-control');
const submit = document.querySelector('.search-btn');
const dimensionsNav = document.querySelector('.dimensions');
const charactersNav = document.querySelector('.characters');

const App = start => {
	const pages = [1, 2, 3];
	let page = 1;
	const clearScreen = () => {
		while (container.firstChild) container.removeChild(container.firstChild);
		spinner.classList.remove('d-none');
	};
	const onLoadCharactersHandler = async (type, character) => {
		const generateCard = character => {
			container.innerHTML += `<div class="card col" style="width: 14rem">
				<img src="${character.image}" class="card-img-top" alt="${character.name} character" />
				<div class="card-body">
					<h5 class="card-title">${character.name}</h5>
					<p class="card-text">
						${character.location.name}
					</p>
					<a href="#" class="btn btn-primary">${character.status}</a>
				</div>
			</div>`;
			spinner.classList.add('d-none');
		};
		clearScreen();
		const main = 'https://rickandmortyapi.com/api/character';
		const endpointPages = main + '?page=' + page;
		const endpointCharacter = main + '/?name=' + character;
		const endpoint = !character ? endpointPages : endpointCharacter;
		try {
			const { data } = await axios.get(endpoint);
			if (type === 'next') page++;
			if (type === 'prev') page--;
			if (typeof type === 'string') {
				const res = await axios.get(data.info[type]);
				return res.data.results.forEach(generateCard);
			}
			return data.results.forEach(generateCard);
		} catch (error) {
			console.log(error);
			container.innerHTML += `<p>There is nothing here! ${error}</p>`;
			setTimeout(() => {
				onLoadCharactersHandler();
			}, 2000);
		}
	};
	const setPages = button => {
		button.addEventListener('click', e => {
			const isNext = e.target.textContent.trim().toLowerCase() === 'next';
			if (!isNext && pages[0] === 1) return;
			for (let i = 0; i < pages.length; i++) {
				if (isNext) pages[i]++;
				if (!isNext) pages[i]--;
				buttons[i].textContent = pages[i];
			}
			onLoadCharactersHandler(isNext ? 'next' : 'prev');
		});
	};
	const setCustomPages = button => {
		button.addEventListener('click', e => {
			let newValue = e.target.textContent;
			page = newValue;
			for (let i = 0; i < pages.length; i++) {
				pages[i] = newValue++;
				buttons[i].textContent = pages[i];
			}
			onLoadCharactersHandler();
		});
	};
	const searchCharacter = e => {
		e.preventDefault();
		clearScreen();
		setTimeout(() => {
			onLoadCharactersHandler(undefined, inputSearch.value);
		}, 500);
	};
	const loadDimensions = async () => {
		const endpoint = 'https://rickandmortyapi.com/api/location';
		const res = await axios.get(endpoint);
		clearScreen();
		const generateDimension = dimension => {
			container.innerHTML += `<div class="card col" style="width: 14rem">
				<div class="card-body">
					<h5 class="card-title">${dimension.name}</h5>
					<p class="card-text">
						${dimension.type}
					</p>
					<p class="card-text">
						Number of residents: <span class="text-danger">${dimension.residents.length}</span>
					</p>
					<a href="#" class="btn btn-primary">${dimension.dimension}</a>
				</div>
			</div>`;
			spinner.classList.add('d-none');
		};
		res.data.results.forEach(generateDimension);
	};

	if (start) onLoadCharactersHandler();
	dimensionsNav.addEventListener('click', loadDimensions);
	submit.addEventListener('click', searchCharacter);
	charactersNav.addEventListener('click', onLoadCharactersHandler);
	prevAndNext.forEach(setPages);
	buttons.forEach(setCustomPages);
};

App(true);
