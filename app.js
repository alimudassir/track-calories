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
    },

    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    getItemById: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      //Get ids
      ids = data.items.map((item) => {
        return item.id;
      });

      //Get Index
      const index = ids.indexOf(id);

      //Remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    }
  }

})();


//UI Controller 
const UICtrl = (function () {

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    listItems: '#item-list li',
    clearBtn: '.clear-btn'
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

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn node list to array
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name} : </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        listItem.remove();
      });
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    }

  }
})();


//App Controller 
const App = (function (ItemCtrl, UICtrl) {

  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Clear all item event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

      // Get Total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories
      UICtrl.showTotalCalories(totalCalories);

      //Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  //Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;  //item-0
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      const itemForEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemForEdit);

      UICtrl.addItemToForm();

    }

    e.preventDefault();
  }

  //Update item submit
  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput();

    //Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListItem(updatedItem);

    // Get Total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Delete button event
  const itemDeleteSubmit = function (e) {
    //Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);

    // Get Total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Clear Items event
  const clearAllItemsClick = function (e) {
    //Delete all items from DS
    ItemCtrl.clearAllItems();

    // Get Total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories
    UICtrl.showTotalCalories(totalCalories);

    //Remove from UI
    UICtrl.removeItems();
    UICtrl.hideList();
  }

  return {
    init: function () {
      //Set initial state
      UICtrl.clearEditState();

      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      // Get Total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories
      UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();