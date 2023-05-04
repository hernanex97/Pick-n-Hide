const selectElementButton = document.getElementById("selectElement");
console.log(selectElementButton);

async function getCurrentTab(){
  const queryOptions = {active: true, currentWindow: true};
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

selectElementButton.addEventListener('click', async() => {
  const tab = await getCurrentTab();

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: inspectElement,
  }).then(() => console.log("injected a function"));
})


function inspectElement() {
  console.log("calling inspect Element function");
  // Create a new Promise that resolves when an element is selected
  return new Promise((resolve) => {
    // Define the styles for the highlight element
    const highlightStyles = `
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    box-sizing: border-box;
    border: 2px solid #ffa500;
    border-radius: 3px;
  `;

    // Create the highlight element
    const highlightElement = document.createElement("div");
    highlightElement.style.cssText = highlightStyles;
    document.body.appendChild(highlightElement);

    // Add a click event listener to the document
    document.addEventListener("click", onClick, { capture: true });

    // Define the onClick function
    function onClick(event) {
      // Get the element that was clicked
      const element = event.target;

      // Remove the event listeners and the highlight element
      document.removeEventListener("click", onClick, { capture: true });
      highlightElement.remove();

      // Build an object with information about the element
      const elementInfo = {
        tagName: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        classList: element.classList.toString(),
        attributes: [],
        textContent: element.textContent.trim(),
      };

      // Add each of the element's attributes to the object
      for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        elementInfo.attributes.push({
          name: attribute.name,
          value: attribute.value,
        });
      }

      // Resolve the Promise with the element information
      resolve(elementInfo);
      if(elementInfo.id == ""){

        const elementstags = document.getElementsByTagName(elementInfo.tagName)
        for (let i = 0; i < elementstags.length; i++) {
          if (elementstags[i].textContent == elementInfo.textContent){
            elementstags[i].textContent = '******';
          }
        }
        console.log(elementInfo);
        console.log(elementInfo.textContent);
      }
      else if(document.getElementById(elementInfo.id).id != "selectElement" || document.getElementsByClassName() != "button-box") {
        resolve(elementInfo);
        document.getElementById(elementInfo.id).textContent = "******";
        document.body.style.backgroundColor = "red";
        console.log(elementInfo);
        console.log(elementInfo.textContent);
      }

    }

    // Add a mousemove event listener to the document to highlight the current element
    document.addEventListener("mousemove", onMouseMove);

    // Define the onMouseMove function
    function onMouseMove(event) {
      // Get the element that the mouse is currently over
      const element = event.target;

      // Highlight the element
      const elementRect = element.getBoundingClientRect();
      highlightElement.style.left = `${elementRect.left}px`;
      highlightElement.style.top = `${elementRect.top}px`;
      highlightElement.style.width = `${elementRect.width}px`;
      highlightElement.style.height = `${elementRect.height}px`;
    }
  });
}








