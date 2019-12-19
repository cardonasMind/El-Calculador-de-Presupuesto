// budgetController controls the budget (data and those things)
const budgetController = (function () {
    // This variable contains the general data
    var general = {
        budget: 0,
        inc: 0,
        exp: 0
    }

    // This variable contains every income and expenses item and the total of that
    var data = {
        inc: {
            lastId: 0,
            items: []
        },
        exp: {
            lastId: 0,
            items: []
        },
        totalItems: 0
    }

    const Item = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value;
    }

    return {
        // This functions update the general income or expenses
        updateMoney: function(values, moneyUI) {
			// Check if the values got from removeItem
			if(values.removeItem) {
				if(values.type === "inc") {
                general[values.type] -= values.value;
				} else {
					general[values.type] += values.value;
				}
			} else {
				if(values.type === "inc") {
                general[values.type] += values.value;
				} else {
					general[values.type] -= values.value;
				}
			}
            moneyUI(values);
        },

        // This function updates the budget
        updateBudget: function(budgetUI) {
            budgetUI(general.budget = general.inc + general.exp);
        },

        // This functions add a new item
        addItem: function(values, putNewItem) {
            // First we need to crate a new Item
            const id = data[values.type].lastId;
            const newItem = new Item(id, values.description, values.value);

            // Then we need to insert the item in its respective items array
            data[values.type].items[id] = newItem;

            // Finally we update some stuffs and then we insert the item in UI
            data[values.type].lastId++;
            data.totalItems++;

            putNewItem(values.type, data[values.type].items[id]);
        },

        // Remove an item from the data
        removeItem: function(itemId, itemType) {
            // For delete an element from the budget we need to find the index in the array of the id

            // 1. First we delete the item from the data and update some things
			const ids = data[itemType].items.map(current => current.id);
			const itemIndex = ids.indexOf(itemId);
			
			data[itemType].items.splice(itemIndex, 1);
			data.totalItems--;
        }
    }
})()

// UIController controls everything of the UI 
const UIController = (function() {
    /* 
        Defining any DOM elements 
    */

    // That const has all the ids of the DOM elements
    const ids = {
        // Header elements
        generalBudget: 'general-budget',
        generalIncome: 'general-income',
        generalExpenses: 'general-expenses',

        // #add-item-container elements
        addItemContainer: 'add-item-container',
        typeInput: 'type-input',
        descriptionInput: 'description-input',
        valueInput: 'value-input',
        addItemButton: 'add-item-button',

        // #income-list
        incomeList: 'income-list',
        // #expenses-list
        expensesList: 'expenses-list'
    }

    // This object contains every DOM object
    DOMElements = {
        // Header elements
        generalBudget: document.getElementById(ids.generalBudget),
        generalIncome: document.getElementById(ids.generalIncome),
        generalExpenses: document.getElementById(ids.generalExpenses),

        // MIDDLE SECTION (#add-item-container) ELEMENTS
        addItemContainer: document.getElementById(ids.addItemContainer),
        typeInput: document.getElementById(ids.typeInput),
        descriptionInput: document.getElementById(ids.descriptionInput),
        valueInput: document.getElementById(ids.valueInput),
        addItemButton: document.getElementById(ids.addItemButton),

        // Section where the items going (#income-list, #expenses-list)
        incomeList: document.getElementById(ids.incomeList),
        expensesList: document.getElementById(ids.expensesList)
    }

    return {
        ids,
        DOMElements,

        // Function for get the values of the inputs
        getNewItem: function(e) {
            return {
                type: DOMElements.typeInput.value,
                description: DOMElements.descriptionInput.value,
                value: Number(DOMElements.valueInput.value)
            }
        },

        // Function for update the general income or expenses
        updateMoneyUI: function(money) {
			// Check if the values got from removeItem
			if(money.removeItem) {
				if(money.type === "inc") {
					DOMElements.generalIncome.innerText = parseFloat(DOMElements.generalIncome.innerText) - money.value;
				} else {
					DOMElements.generalExpenses.innerText = parseFloat(DOMElements.generalExpenses.innerText) - money.value;
				}
			} else {
				if(money.type === "inc") {
					DOMElements.generalIncome.innerText = parseFloat(DOMElements.generalIncome.innerText) + money.value;
				} else {
					DOMElements.generalExpenses.innerText = parseFloat(DOMElements.generalExpenses.innerText) + money.value;
				}
			}
            
        },

        // Function for update the general budget
        updateBudgetUI: function(budget) {
            DOMElements.generalBudget.innerText = budget;
        },

        // Convert a number into Colombia money (0.000.000) (FOR LATER)

        // This function is for insert the item into the DOM
        putNewItem: function(type, item) {
            /* That so useless and now (15/12/2019) I know another method to add all those stuffs in the DOM 
            and it´s using a string and then replacing some default things like description and value */
            // This object contains the structure of every item 
           const itemStructure = {
                item: document.createElement('div'),
                description: document.createElement('h3'),
                value: document.createElement('p'),
                deleteItem: document.createElement('span')
            }

            // Now we put every item where It need to be
            itemStructure.item.classList.add('item-container');

            itemStructure.description.innerText = item.description;
            itemStructure.description.classList.add('item-description');

            itemStructure.value.innerText = item.value;
            itemStructure.value.classList.add('item-value');

            itemStructure.deleteItem.innerText = "X Borrar";
            itemStructure.deleteItem.classList.add('delete-item');

            itemStructure.item.appendChild(itemStructure.description);
            itemStructure.item.appendChild(itemStructure.value);
            itemStructure.item.appendChild(itemStructure.deleteItem);

            if(type === "inc") {
                // Adding an id for select the item after most easily
                itemStructure.item.id = `inc-${item.id}`;
                // Here we put the item into the list
                DOMElements.incomeList.insertBefore(itemStructure.item, DOMElements.incomeList.childNodes[0]);
            } else {
                itemStructure.item.id = `exp-${item.id}`;
                DOMElements.expensesList.insertBefore(itemStructure.item, DOMElements.expensesList
                    .childNodes[0]);
            }
        },

        removeItemUI: function(itemId) {
            const item = document.getElementById(itemId)
            item.parentNode.removeChild(item);
        }
    }
})()

// controller just controls everything (controls the budget and the UI)
const controller = (function (budgetController, UIController) {
    const DOMElements = UIController.DOMElements;

    /*
        Functions
    */

    // Convert an number into a "0.000.000" number (like Colombia money)
    //const numberTo

    // Function for create a new item (item income or expenses)
    const addNewItem = e => {
        // First we get the data
        const values = UIController.getNewItem(e);

        // Then we pass the data type and value to the budgetController for update the general-income 
        // or general-expenses
        budgetController.updateMoney(values, UIController.updateMoneyUI);

        // Then we update the general budget
        budgetController.updateBudget(UIController.updateBudgetUI);

        // And finally we create the element in the DOM
        budgetController.addItem(values, UIController.putNewItem);
    }

    // Remove an item
    const removeItem = (item) => {
        // Check if press a delete button
        if(item.target.textContent === "X Borrar") {
            // 1. Get the id of the item
            const fullItemId = item.path[1].id;
            const fullItemIdParts = fullItemId.split('-');
            const itemType = fullItemIdParts[0];
            const itemId = Number(fullItemIdParts[1]);

			// 2. Now we need to delete it from the budget
            budgetController.removeItem(itemId, itemType);
			
			// 3. Then we need to update the inc or exp
			const values = {
				removeItem: true,
				type: itemType,
                value: Number(item.path[1].children[1].innerText)
			}
			budgetController.updateMoney(values, UIController.updateMoneyUI);
			
			// 4. Then we need to upate the general buget
			budgetController.updateBudget(UIController.updateBudgetUI);

            // 3. An finally we delete the item from the DOM
            UIController.removeItemUI(fullItemId);
        }
    }

    // This function change the background color of #add-item-container
    DOMElements.typeInput.onchange = e => {
        if(e.target.value === "inc") {
            DOMElements.addItemContainer.style.backgroundColor = "rgb(193, 245, 189)";
        } else {
            DOMElements.addItemContainer.style.backgroundColor = "rgb(245, 189, 189)";
        }
    }

    // Evnt listener for the "Aceptar" button and the Enter key
    DOMElements.addItemButton.onclick = addNewItem;
    document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 || e.which === 13) {
            addNewItem(e);
        }
    });

    // Setting an event listener for remove an item
    document.addEventListener('click', function(e) {removeItem(e)})

})(budgetController, UIController)