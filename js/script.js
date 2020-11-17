document.addEventListener('DOMContentLoaded', () => {

/* Сортировка, начало */

    const table = document.querySelector('.table');
    let colIndex = -1;

    const tableSort = function (index, type, isSorted) {
        const tbody = table.querySelector('tbody');
        
        const compare = function(rowA, rowB) {
            const rowDataA = rowA.cells[index].innerHTML;
            const rowDataB = rowB.cells[index].innerHTML;
            
            switch (type) {
                case 'integer':
                case 'double':
                    return rowDataA - rowDataB;
                    break;
                case 'date':
                    const dateA = rowDataA.split('.').reverse().join('-');
                    const dateB = rowDataB.split('.').reverse().join('-');
                    return new Date(dateA).getTime() - new Date(dateB).getTime();
                    break;
                case 'text':
                    if (rowDataA < rowDataB) return -1;
                    if (rowDataA > rowDataB) return 1;
                    
                        return 0;
                    
                    break;          
            }
        }

        let rows = [].slice.call(tbody.rows);
        rows.sort(compare);

        if (isSorted) rows.reverse();

        table.removeChild(tbody);

        for (let i = 0; i < rows.length; i++) {
            tbody.appendChild(rows[i]);
        }
        table.appendChild(tbody);
    }

    table.addEventListener('click', function(event){
        const target = event.target;
        if(target.nodeName != 'TH') return false;
        const index = target.cellIndex;
        const type = target.getAttribute('data-type');

        colIndex = (colIndex == index) ? -1 : index;
        tableSort(index, type, colIndex == index);
    });

    /* Сортировка, конец */


    /* Вывод значений в футер таблицы, начало */

    let tfoot = document.querySelector('tfoot'),
        tfootChild = tfoot.querySelectorAll('td'),
        salary = document.querySelectorAll('.salary');

        function footerValues() {
            for (let i = 0; i < tfootChild.length; i++){
                tfootChild[i].textContent = table.rows.length - 2;
                if (i == 2){
                    let total = 0;
                    for (let j = 0; j < salary.length ; j++) {
                        total += parseInt(salary[j].innerHTML);
                        tfootChild[i].textContent = total; 
                    }
                }
            }
        }

        footerValues();
        
    
    
    /* Вывод значений в футер таблицы, конец */

    /* Перемещение блоков таблицы, начало */

    $('.table').dragableColumns();

    /* Перемещение блоков таблицы, конец*/

    /* Редактирование в таблице, начало */
    
    let editingTd;

    table.addEventListener('click',function(event) {
        let target = event.target.closest('.cancel, .ok, td');
    
        if (!table.contains(target)) return;

        if (target.className == 'cancel') {
            finishTdEdit(editingTd.elem, false);
        } else if (target.className == 'ok') {
            finishTdEdit(editingTd.elem, true);
        } else if (target.nodeName == 'TD') {
            if (editingTd) return;

            makeTdEditable(target);
        }
    });

    function makeTdEditable(td) {
        editingTd = {
            elem: td,
            data: td.innerHTML
        };

        td.classList.add('edit-td');

        let textArea = document.createElement('textarea');
        textArea.style.width = 200 + 'px';
        textArea.style.height = 30 + 'px';
        textArea.className = 'edit-area';

        textArea.value = td.innerHTML;
        td.innerHTML = '';
        td.appendChild(textArea);
        textArea.focus();

        td.insertAdjacentHTML("beforeEnd",
        '<div class="edit-controls"><button class="ok">OK</button><button class="cancel">CANCEL</button></div>'
        );
    }

    function finishTdEdit(td, isOk) {
        if (isOk) {
            td.innerHTML = td.firstChild.value;
            footerValues();
        } else {
            td.innerHTML = editingTd.data;
        }

        td.classList.remove('edit-td');
        editingTd = null;
    }

    /* Редактирование в таблице, конец */
});