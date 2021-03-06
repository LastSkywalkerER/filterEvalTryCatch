// функция принимает тип и коллекцию значений и сохраняет в массив values, перебирает массив и возвращает новый массив со значениями тип которых совпадает с переданным типом
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	// скрывает все блоки главные с результатами в вёрстке
	hideAllResponseBlocks = () => {
		// получаем массив блоков с результатами с тегом div, вроде 3 насчитал
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// перебираем блоки и скрываем
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	// получает селектор блока результата, собщение и селектор блока текста в блоке результатов, показывает блок и если был передан селектор блока текста - выводит текст
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// вызов функции скрытия всех блоков результатов
		hideAllResponseBlocks();
		// показываем блок результатов по переданному селектору
		document.querySelector(blockSelector).style.display = 'block';
		// проверяем был ли передан селектор блока текста
		if (spanSelector) {
			// выводим текст в блок с текстом
			document.querySelector(spanSelector).textContent = msgText;
		}
	},

	// вывод сообщения об ошибке через вызов функции showResponseBlock
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	// вывод сообщения с результатми через вызов функции showResponseBlock
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	// вывод сообщения об отсутсвии результатов через вызов функции showResponseBlock
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// получает тип и строку со значениями в синтаксисе перечисления аргументов функции, пытается вывести результат фильтрации в случае неудачи выводит ошибку (все выводы в блок результатов)
	tryFilterByType = (type, values) => {
		// попытка выполнения нижеидущего блока кода
		try {
			// запись в переменную результата выполнения функции filterByType сконткатинированного через запятую в строку
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// запись в переменную сообщения о присутсвии или отсутсвии данных с нужным типом
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			// вызов функции отображающей результат с текстом alertMsg на странице
			showResults(alertMsg);
		} catch (e) { // отлавливание ошибок
			// вызов функции отображающей ошибку e на странице
			showError(`Ошибка: ${e}`);
		}
	};

// получаем кнопку Фильтровать
const filterButton = document.querySelector('#filter-btn');

// вешаем на кнопку функцию по клику
filterButton.addEventListener('click', e => {
	// получаем поле Тип данных
	const typeInput = document.querySelector('#type');
	// получаем поле Данные
	const dataInput = document.querySelector('#data');

	// проверяем заполнено ли поле с данными и запускаем фильтр в случае успеха
	if (dataInput.value === '') {
		// вешаем кастомное сообщение о пустом поле
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// вызываем вывод об отсуствии данных
		showNoResults();
		// иначе
	} else {
		// очищаем кастомное ообщение валидации
		dataInput.setCustomValidity('');
		// отменяем стандартные действия по клику на кнопку (обновление страницы скорее всего)
		e.preventDefault();
		// пытаемся отфильтровать данные по типу вызовом функции tryFilterByType и передаём туда значения полей
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});