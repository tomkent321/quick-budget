// BUDGET CONTROLLER /////////////////////////////

// constructors

const budgetController = (() => {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = type => {
    let sum = 0;
    data.allItems[type].forEach(element => {
      sum = sum + element.value;
    });
    data.totals[type] = sum;
  };

  // data structure

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, description, value) {
      let newItem, ID;

      // New ID
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      // Create new data item based on type
      if (type === 'exp') {
        newItem = new Expense(ID, description, value);
      } else if (type === 'inc') {
        newItem = new Income(ID, description, value);
      }

      // Push the new item to the data object
      data.allItems[type].push(newItem);
      console.log(data);
      return newItem;
    },

    calculateBudget: type => {
      // let budgetTotal;

      // calc total income and expenses
      calculateTotal(type);
      // calc the budget: income- expenses

      data.budget = data.totals.inc - data.totals.exp;

      // calc the pct of income spent
      if (data.totals.inc > 0 && data.budget > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

//////////////////////////////////////////////////////////////////////////////////////////
//UI CONTROLLER //////////////////////////////////////////////////////////////////////////

const UIController = (() => {
  //DS = DOM String html identifiers
  const DS = {
    inpType: '.add__type',
    inpDesc: '.add__description',
    inpVal: '.add__value',
    inpBtn: '.add__btn',
    incCont: '.income__list',
    expCont: '.expenses__list',
    budVal: '.budget__value',
    budExp: '.budget__expenses--value',
    budInc: '.budget__income--value',
    budPct: '.budget__expenses--percentage',
    container: '.container'
  };

  return {
    getInput: () => {
      return {
        type: $(DS.inpType).val(),
        description: $(DS.inpDesc).val(),
        value: parseFloat($(DS.inpVal).val())
        // $(DS.inpType).val() === 'inc' ? $(DS.inpVal).val() : $(DS.inpVal).val() * -1
      };
    },

    addListItem: (obj, type) => {
      let html, newHtml, element;

      // Create html string w placeholder text

      if (type === 'inc') {
        element = DS.incCont;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DS.expCont;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%pct%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with actual data

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Place html in UI

      $(element).append(newHtml);
    },

    clearFields: () => {
      let fields, fieldsArr;

      fields = document.querySelectorAll(DS.inpDesc + ',' + DS.inpVal);

      // convert this list to an array

      fieldsArr = Array.prototype.slice.call(fields); //sets the this of the Array prototype to the fields list

      fieldsArr.forEach(function(current) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: obj => {
      $(DS.budVal).text(obj.budget > 0 ? '+ ' + obj.budget : '- ' + obj.budget);
      $(DS.budExp).text('- ' + obj.totalExp);
      $(DS.budInc).text('+ ' + obj.totalInc);
      $(DS.budPct).text(obj.percentage > 0 ? String(obj.percentage) + '%' : '---');
    },

    resetBudget: () => {
      $(DS.budVal).text('0');
      $(DS.budExp).text('0');
      $(DS.budInc).text('0');
      $(DS.budPct).text('---');
    },

    getDOMstrings: () => {
      return DS;
    }
  };
})();

//////////////////////////////////////////////////////////////////////////////////////////
// APP CONTROLLER ///////////////////////////////////////////////////////////////////////

const controller = ((budgetCtrl, UICtrl) => {
  const setupEventListeners = () => {
    const DS = UICtrl.getDOMstrings();

    $(DS.inpBtn).click(ctrlAddItem);

    $(document).on('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    $(DS.container).click(ctrlDeleteItem);
  };

  const updateBudget = type => {
    // 1. calc the budget
    budgetCtrl.calculateBudget(type);

    // 2. Return the budget
    let budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = () => {
    let input, newItem;

    // 1. Get field input data
    input = UICtrl.getInput();

    //test to make sure all input fields have been filled before continuing
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. add item to budgetcontroller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calc and update the budget

      updateBudget(input.type);
    }
  };

  const ctrlDeleteItem = e => {
    let itemId, splitID, type, ID;

    itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = splitID[1];

      // 1. deleted item from the data structure

      // 2. delete item from UI

      // 3. update and show new budget
    }
  };

  return {
    init: () => {
      console.log('Application has started.');
      UICtrl.resetBudget();
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
