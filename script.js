const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterBtn = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;



function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  clearUI();
}
 

function filterItems(e)
{
  const text = e.target.value.toLowerCase(); 
  // console.log(text);
  const items = document.querySelectorAll('li');

  items.forEach(item =>{
    const itemName = item.firstChild.textContent.toLowerCase();
    if(itemName.indexOf(text) !== -1)
    {
      item.style.display = 'flex';
    }
    else{
      item.style.display = 'none';
    }
  });
  


}
function onClick(e)
{
  if(e.target.parentElement.classList.contains('remove-item'))
  {
    removeItem(e.target.parentElement.parentElement);
  }
  else if(e.target.parentElement.id === 'item-list')
  {
    setItemToEdit(e.target);
  }
  
    
}

function setItemToEdit(item){
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i) => {i.classList.remove('edit-mode');});
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"> </i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(text)
{
  
  if(confirm('Are you sure?'))
  {
    // e.remove();
    // console.log(text.textContent);
    const items = document.querySelectorAll('li');

    items.forEach(item =>{
    const itemName = item.firstChild.textContent.toLowerCase();
    const givenName = text.textContent.toLowerCase();
    if(itemName === givenName)
    {
      item.remove();
    }
          
    });
  


    // clearUI();
    removeItemFromStorage(text.textContent);
    
    // displayItems();

  }
  
  
}

function removeItemFromStorage(e)
{
  // console.log(e);
  let itemsFromStorage = getItemsFromStorage();
  
  // Filterout Elemets to be removed
  itemsFromStorage = itemsFromStorage.filter((item) => item.toLowerCase() !== e.toLowerCase());
  // displayItems();
  // Re-Set to local storage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage));

}


function onAddItemSubmit(e) {
  e.preventDefault();
 
  // validate input
  const value = itemInput.value;
  if(value === '')
  {
    alert("Please add an item");
    return;  
  }
  // check for edit mode
  if(isEditMode)
  {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false; 

  }
  else
  {
    if(checkItemAlreadyExists(value))
    {
      alert("Item already exists!");
      return;
    }
  }
  addItemToDOM(value);
  
  addItemToStorage(value);
  clearUI();
}


function addItemToDOM(value)
{
  // create list of items
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(value));

  const buttons = createButton('remove-item btn-link text-red');

  li.appendChild(buttons);
  itemList.appendChild(li);

  clearUI();

  itemInput.value = '';
}

function addItemToStorage(item)
{
  const itemsFromStorage = getItemsFromStorage();

  

  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function getItemsFromStorage()
{
  let itemsFromStorage;

  if(localStorage.getItem('items') === null)
  {
    itemsFromStorage = [];
  }
  else
  {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}
function clearUI()
{
  itemInput.value = '';
  const items = document.querySelectorAll('li');
  if(items.length === 0)
  {
    clearBtn.style.display = 'none';
    filterBtn.style.display = 'none';
  }
  else{
    clearBtn.style.display = 'block';
    filterBtn.style.display = 'block';

  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"> </i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;

}
function createButton(classes)
{
  const buttons = document.createElement('button');
  buttons.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  buttons.appendChild(icon);
  return buttons;
}

function createIcon(classes)
{
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function checkItemAlreadyExists(item)
{
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item.toLowerCase());
}

function clearItems(e)
{
  // itemList.remove();
  while(itemList.firstChild)
  {
    itemList.removeChild(itemList.firstChild);
  }
  clearUI();

  

}

function init()
{
    // EventListener

    itemForm.addEventListener('submit',onAddItemSubmit);
    itemList.addEventListener('click',onClick);
    clearBtn.addEventListener('click',clearItems);
    filterBtn.addEventListener('input',filterItems);
    document.addEventListener('DOMContentLoaded',displayItems);
    clearUI();
}

init();
