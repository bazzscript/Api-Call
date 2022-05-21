const addItemBtn = document.getElementById("addItemBtn");
const itemTable = document.getElementById("item-table");
const deletedItemTable = document.getElementById("deleted-item-table");
const editSection = document.getElementById("edit-section");
const saveItemBtn = document.getElementById("saveItemBtn");

// add listing function
const addItem = function () {
  var data = {
    name: document.getElementById("item-name").value,
    description: document.getElementById("item-description").value,
    quantity: document.getElementById("item-quantity").value,
    price: document.getElementById("item-price").value,
  };

  var config = {
    method: 'post',
    url: 'http://localhost:8000/api/v1/inventory/add',
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

// delete listing function
const deleteItem = (event) => {
  let id = event.target.parentElement.parentElement.children[0].innerHTML;
  let forDelete = event.target.parentElement.children[0].innerHTML;

  if (forDelete.startsWith("Delete")) {
    editSection.style.display = "block";

    editSection.innerHTML = ``;
      const presData = `
      <div class="form-container">
      <form>
          <div class="item">
              <label for="deletionComment">Add Deletion Comment (optional)</label>
              <input id="deletionComment" type="text" placeholder="Add optional comment here"></input>
          </div>
          <button type="button" value="${id}" onclick="confirmDelete(this)" id="hidden-delete">Confirm Delete</button>
          <button type="button" onclick="removeEditSection()">Cancel</button>
      </form>
      </div>
      `;
    editSection.innerHTML = presData;
  }
};

// undelete listing function
const undeleteItem = (event) => {
  let id = event.target.parentElement.parentElement.children[0].innerHTML;
  let forDelete = event.target.parentElement.children[0].innerHTML;

  if (forDelete.startsWith("Undelete")) {
    var config = {
      method: 'patch',
      url: `http://localhost:8000/api/v1/inventory/undelete/${id}`,
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

  if (forEdit.startsWith("Edit")) {
    editSection.style.display = "block";

    var config = {
      method: 'get',
      url: `http://localhost:8000/api/v1/inventory/get/${id}`,
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
                <input id="itemName" type="text" value="${dData.name}"></input>
            </div>
            <div class="item">
                <label for="itemDescription">Item Description</label>
                <input id="itemDescription" type="text" value="${dData.description}"></input>
            </div>
            <div class="item">
                <label for="itemQuantity">Item Quantity</label>
                <input id="itemQuantity" type="text" value="${dData.quantity}"></input>
            </div>
            <div class="item">
                <label for="itemPrice">Item Price</label>
                <input id="itemPrice" type="text" value="${dData.price}"></input>
            </div>
            <button type="button" value="${id}" onclick="saveEdit(this)" id="hidden-edit">Save</button>
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
  var data = {
    name: item_name.value,
    description: item_description.value,
    quantity: item_quantity.value,
    price: item_price.value,
  };
  var config = {
    method: 'put',
    url: `http://localhost:8000/api/v1/inventory/update/${item.value}`,
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

// save edit from secret edit section
const confirmDelete = (item) => {
  const deletionComment = document.getElementById("deletionComment").value;
  var data = {
    comment: deletionComment
  };
  var config = {
    method: 'delete',
    url: `http://localhost:8000/api/v1/inventory/delete/${item.value}`,
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
  var config = {
    method: 'get',
    url: 'http://localhost:8000/api/v1/inventory/',
    headers: {}
  };

  axios(config)
    .then(function (response) {
      const dbItems = response.data.data;
      itemTable.innerHTML = `
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr> `
      ;
      dbItems.forEach(function (item) {
        let addNewItem = `
        <tr>
            <td>${item.SKU}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
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

// get all deleted items function
const getAllDeletedItems = () => {
  var config = {
    method: 'get',
    url: 'http://localhost:8000/api/v1/inventory/deleted',
    headers: {}
  };

  axios(config)
    .then(function (response) {
      const dbItems = response.data.data;
      console.log(dbItems);
      deletedItemTable.innerHTML = `
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Comment</th>
          <th>Undelete</th>
        </tr> `
      ;
      dbItems.forEach(function (item) {
        let addNewItem = `
        <tr>
            <td>${item.SKU}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.comment}</td>
            <td><button type="button">Undelete</button></td>
        </tr>`;
        deletedItemTable.innerHTML += addNewItem;
      });
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
    });
};

// adding event listeners to the buttons
addItemBtn.addEventListener("click", addItem);
itemTable.addEventListener("changed", getAllItems());
deletedItemTable.addEventListener("changed", getAllDeletedItems());

// add event listener to all the child elements of the itemTable
itemTable.addEventListener("click", deleteItem);
itemTable.addEventListener("click", editItem);

deletedItemTable.addEventListener("click", undeleteItem);