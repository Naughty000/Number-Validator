

// In your validator.js
let space = document.querySelector("#space");
let check_btn = document.querySelector("#check_btn");
let clear_btn = document.querySelector("#clear_btn");
let initial_space = document.querySelector("#initial-space");

check_btn.addEventListener('click', () => {
    let user_input = document.querySelector("#number");
    let value_user = user_input.value;
    let length_number = value_user.length;

    if (initial_space) {
        initial_space.remove();
        initial_space = null; 
    }

    let result = document.createElement('p');
    result.classList.add('text-[1.25rem]', 'text-center', 'mt-4');
    
    if ((length_number !== 13 || !value_user.startsWith("+92")) && 
        (length_number !== 11 || !value_user.startsWith("0"))) {
        result.textContent = `Invalid Number: ${value_user}`;
        result.style.color = "red";
    } else {
        result.textContent = `Valid Number: ${value_user}`;
        result.style.color = "black";
    }

    space.appendChild(result);
});

clear_btn.addEventListener('click', () => {
    document.querySelector("#number").value = "";
    
    // Clear all results
    while (space.firstChild) {
        space.removeChild(space.firstChild);
    }
    
    // Restore initial spacing
    space.innerHTML = '<div id="initial-spacing"><br><br><br><br><br><br><br></div>';
    initial_space = document.querySelector("#initial-space");
});