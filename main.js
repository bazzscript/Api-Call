const addWarehouseBtn = document.getElementById("addWarehouseBtn");
const addItemBtn = document.getElementById("addItemBtn");
const warehouseDropDown = document.getElementById("item-warehouse");
const itemTable = document.getElementById("item-table");
const editSection = document.getElementById("edit-section");
const saveItemBtn = document.getElementById("saveItemBtn");

// add item function
const addItem = function () {
  var data = {
    item_name: document.getElementById("item-name").value,
    item_description: document.getElementById("item-description").value,
    item_quantity: document.getElementById("item-quantity").value,
    item_price: document.getElementById("item-price").value,
    item_warehouse: document.getElementById("item-warehouse").value
  };

  var config = {
    method: 'post',
    url: 'https://bazzinventory.herokuapp.com/api/v1/inventory/add-item',
    headers: {},
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    });
};

// add warehouse function
const addWarehouse = () => {
  var data = {
    warehouse_name: document.getElementById("warehouse-name").value,
    warehouse_address: document.getElementById("warehouse-address").value
  };

  var config = {
    method: 'post',
    url: 'https://bazzinventory.herokuapp.com/api/v1/warehouse/add-warehouse',
    headers: {},
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    });
};

// delete warehouse function
const deleteItem = (event) => {
  let id = event.target.parentElement.parentElement.children[0].innerHTML;
  let forDelete = event.target.parentElement.children[0].innerHTML;

  if (id.startsWith("SKU") && forDelete.startsWith("Delete")) {
    var config = {
      method: 'delete',
      url: `https://bazzinventory.herokuapp.com/api/v1/inventory/delete-item/${id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
        alert(error.response.data.message);
      });
  }
};

// remove edit section
const removeEditSection = () => {
  editSection.style.display = "none";
};


// edit inventory function
const editItem = (event) => {
  let id = event.target.parentElement.parentElement.children[0].innerHTML;
  let forEdit = event.target.parentElement.children[0].innerHTML;

  if (id.startsWith("SKU") && forEdit.startsWith("Edit")) {
    editSection.style.display = "block";

    var config = {
      method: 'get',
      url: `https://bazzinventory.herokuapp.com/api/v1/inventory/get-item/${id}`,
      headers: {}
    };

    axios(config)
      .then(function (response) {
        const dData = response.data.data;
        editSection.innerHTML = ``;
        const presData = `
        <div class="form-container">
        <form>
            <div class="item">
                <label for="itemName">Item Name</label>
                <input id="itemName" type="text" value="${dData.itemName}"></input>
            </div>

            <div class="item">
                <label for="itemDescription">Item Description</label>
                <input id="itemDescription" type="text" value="${dData.itemDescription}"></input>
            </div>
            <div class="item">
                <label for="itemQuantity">Item Quantity</label>
                <input id="itemQuantity" type="text" value="${dData.itemQuantity}"></input>
            </div>
            <div class="item">
                <label for="itemPrice">Item Price</label>
                <input id="itemPrice" type="text" value="${dData.itemPrice}"></input>
            </div>
            <div class="select" id="warehouseDropdown">
                <label for="itemWarehouse">Select Warehouse</label>
                <select name="" id="itemWarehouse" onclick="getAllEditWarehouses()"></select>
            </div>

            <button type="button" value="${id}" name="${dData.itemWarehouse._id}" onclick="saveEdit(this)" id="hidden-edit">Save</button>
            <button type="button" onclick="removeEditSection()">Cancel</button>
        </form>
        </div>
        `;
        editSection.innerHTML = presData;
      })
      .catch(function (error) {
        console.log(error);
        alert(error.response.data.message);
      });
  }
};

// save edit from secret edit section
const saveEdit = (item) => {
  const item_name = document.getElementById("itemName");
  const item_description = document.getElementById("itemDescription");
  const item_quantity = document.getElementById("itemQuantity");
  const item_price = document.getElementById("itemPrice");
  const item_warehouse = document.getElementById("itemWarehouse");
  var data = {
    item_name: item_name.value,
    item_description: item_description.value,
    item_quantity: item_quantity.value,
    item_price: item_price.value,
    item_warehouse: item_warehouse.value || item.name
  };
  var config = {
    method: 'put',
    url: `https://bazzinventory.herokuapp.com/api/v1/inventory/update-item/${item.value}`,
    headers: {},
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      removeEditSection();
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    });
};


// get all Items function
const getAllItems = () => {
  console.log("get all inventory function is running");
  var config = {
    method: 'get',
    url: 'https://bazzinventory.herokuapp.com/api/v1/inventory/get-all-items',
    headers: {}
  };

  axios(config)
    .then(function (response) {
      const dbItems = response.data.data.items;
      itemTable.innerHTML = `
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Warehouse</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr> `
      ;
      dbItems.forEach(function (item) {
        let addNewItem = `
        <tr>
            <td>${item.itemSku}</td>
            <td>${item.itemName}</td>
            <td>${item.itemDescription}</td>
            <td>${item.itemPrice}</td>
            <td>${item.itemQuantity}</td>
            <td>${item.itemWarehouse.warehouseName}</td>
            <td><button type="button">Edit</button></td>
            <td><button type="button">Delete</button></td>
        </tr>`;
        itemTable.innerHTML += addNewItem;
      });
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    });
};


// get all warehouses function
const getAllWarehouses = () => {
  var config = {
    method: 'get',
    url: 'https://bazzinventory.herokuapp.com/api/v1/warehouse/get-all-warehouses',
    headers: {}
  };

  axios(config)
    .then(function (response) {
      let processedWarehouses = [];
      let processedWarehousesId = [];
      const dbwarehouses = response.data.data.warehouses;
      dbwarehouses.forEach(function (warehouse) {
        processedWarehouses.push(warehouse.warehouseName.toUpperCase());
        processedWarehousesId.push(warehouse._id);
      });

      processedWarehouses.forEach(function (warehouse, index) {
        let addNewWarehouse = `<option value="${processedWarehousesId[index]}">${warehouse} WAREHOUSE</option>`;
        warehouseDropDown.innerHTML += addNewWarehouse;
      });
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    })
  ;
};

const getAllEditWarehouses = () => {
  const item_warehouse = document.getElementById("itemWarehouse");
  if (item_warehouse.value) return;
  var config = {
    method: 'get',
    url: 'https://bazzinventory.herokuapp.com/api/v1/warehouse/get-all-warehouses',
    headers: {}
  };

  axios(config)
    .then(function (response) {
      let processedWarehouses = [];
      let processedWarehousesId = [];
      const dbwarehouses = response.data.data.warehouses;
      dbwarehouses.forEach(function (warehouse) {
        processedWarehouses.push(warehouse.warehouseName.toUpperCase());
        processedWarehousesId.push(warehouse._id);
      });

      processedWarehouses.forEach(function (warehouse, index) {
        let addNewWarehouse = `<option value="${processedWarehousesId[index]}">${warehouse} WAREHOUSE</option>`;
        item_warehouse.innerHTML += addNewWarehouse;
      });
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    })
  ;
};


// adding event listeners to the buttons
addItemBtn.addEventListener("click", addItem);
warehouseDropDown.addEventListener("changed", getAllWarehouses());
itemTable.addEventListener("changed", getAllItems());

// add event listener to all the child elements of the itemTable
itemTable.addEventListener("click", deleteItem);
itemTable.addEventListener("click", editItem);


addWarehouseBtn.addEventListener("click", addWarehouse);