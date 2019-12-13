// budgetController controls the budget (data and those things)
const budgetController = (function () {
    // This variable contains the general data
    var general = {
        budget: 0,
        income: 0,
        expenses: 0
    }

    // This variable contains every income and expenses item and the total of that
    var data = {
        inc: {
            total: 0,
            items: []
        },
        exp: {
            total: 0,
            items: []
        },
        totalItems: 0
    }

    const Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value;
    }

    const Expenses = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value;
    }

    return {
        // This functions update the general income or expenses
        updateMoney: function(values, moneyUI) {
            if(values.type === "inc") {
                general.income += values.value;
                moneyUI(values);
            } else {
                general.expenses -= values.value;
                moneyUI(values);
            }
        },

        // This function updates the budget
        updateBudget: function(budgetUI) {
            budgetUI(general.budget = general.income + general.expenses);
        },

        // This functions add a new item
        addItem: function(values, putNewItem) { 
            console.log(data)
            if(values.type === "inc") {
                // First we create a new Income
                const incomeItem = new Income(data.inc.total, values.description, values.value);
                
                // Then we put it into the items
                data.inc.items[data.inc.total] = incomeItem;

                // Finally we update the total incomes and the totalItems
                data.inc.total++;
                data.totalItems++;

                // Now we need to create the element in the UI
                putNewItem(values.type, data.inc.items[data.inc.total-1])
            } else {
                // First we create a new Income
                const expensesItem = new Expenses(data.inc.total, values.description, values.value);
                
                // Then we put it into the items
                data.exp.items[data.exp.total] = expensesItem;

                // Finally we update the total expenses and the totalItems
                data.exp.total++;
                data.totalItems++;

                // Now we need to create the element in the UI
                putNewItem(values.type, data.exp.items[data.exp.total-1])
            }
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
            if(money.type === "inc") {
                DOMElements.generalIncome.innerText = parseFloat(DOMElements.generalIncome.innerText) + money.value;
            } else {
                DOMElements.generalExpenses.innerText = parseFloat(DOMElements.generalExpenses.innerText) + money.value;
            }
        },

        // Function for update the general budget
        updateBudgetUI: function(budget) {
            DOMElements.generalBudget.innerText = budget;
        },

        // This function is for insert the item into the DOM
        putNewItem: function(type, item) {
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
            itemStructure.deleteItem.onclick = (e) => {
                DOMElements.incomeList.removeChild(e.path[1]);
            }

            itemStructure.item.appendChild(itemStructure.description);
            itemStructure.item.appendChild(itemStructure.value);
            itemStructure.item.appendChild(itemStructure.deleteItem);

            if(type === "inc") {
                // Here we put the item into the list
                DOMElements.incomeList.insertBefore(itemStructure.item, DOMElements.incomeList.childNodes[0]);
            } else {
                DOMElements.expensesList.insertBefore(itemStructure.item, DOMElements.expensesList
                    .childNodes[0]);
            }
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

    // This function change the background color of #add-item-container
    DOMElements.typeInput.onchange = e => {
        if(e.target.value === "inc") {
            DOMElements.addItemContainer.style.backgroundColor = "rgb(193, 245, 189)";
        } else {
            DOMElements.addItemContainer.style.backgroundColor = "rgb(245, 189, 189)";
        }
    }

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

    DOMElements.addItemButton.onclick = addNewItem;
    document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 || e.which === 13) {
            addNewItem(e);
        }
    });

    // Remove an item
    

})(budgetController, UIController)