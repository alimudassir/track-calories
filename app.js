//Item Controller 
const ItemCtrl = (function () {

  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function () {
      return data.items;
    },

    logData: function () {
      return data;
    },

    addItem: function (name, calories) {
      let ID;
      //Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to number
      calories = parseInt(calories);
      //Create new Item
      newItem = new Item(ID, name, calories);
      //Add to items array
      data.items.push(newItem);

      return newItem;
    }
  }

})();


//UI Controller 
const UICtrl = (function () {

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
  }

  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getSelectors: function () {
      return UISelectors;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name} : </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;

      //Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    }
  }
})();


//App Controller 
const App = (function (ItemCtrl, UICtrl) {

  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  const itemAddSubmit = function (e) {
    //Get Fom Input 
    const input = UICtrl.getItemInput();

    //Validation
    if (input.name !== '' && input.calories !== '') {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add Item to UI List
      UICtrl.addListItem(newItem);
      //Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  return {
    init: function () {
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      //Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();