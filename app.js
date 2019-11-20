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

  // data structure

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    }
  };
})();

//UI CONTROLLER /////////////////////////////

const UIController = (() => {
  //DS = DOM String html identifiers
  const DS = {
    inpType: '.add__type',
    inpDesc: '.add__description',
    inpVal: '.add__value',
    inpBtn: '.add__btn',
    incCont: '.income__list',
    expCont: '.expenses__list'
  };

  return {
    getInput: () => {
      return {
        type: $(DS.inpType).val(),
        description: $(DS.inpDesc).val(),
        value: $(DS.inpVal).val()
        // $(DS.inpType).val() === 'inc' ? $(DS.inpVal).val() : $(DS.inpVal).val() * -1
      };
    },

    addListItem: (obj, type) => {
      let html, newHtml, element;

      // Create html string w placeholder text

      if (type === 'inc') {
        element = DS.incCont;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DS.expCont;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%pct%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with actual data

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Place html in UI

      $(element).append(newHtml);
    },

    getDOMstrings: () => {
      return DS;
    }
  };
})();

// APP CONTROLLER /////////////////////////////

const controller = ((budgetCtrl, UICtrl) => {
  const setupEventListeners = () => {
    const DS = UICtrl.getDOMstrings();

    $(DS.inpBtn).click(ctrlAddItem);

    $(document).on('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = () => {
    let input, newItem;

    // 1. Get field input data
    input = UICtrl.getInput();

    // 2. add item to budgetcontroller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. add the item to the UI

    UICtrl.addListItem(newItem, input.type);
    // 4. Calc the budget
    // 5. display budget on UI
  };

  return {
    init: () => {
      console.log('Application has started.');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
