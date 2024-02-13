document.addEventListener('DOMContentLoaded', function() {

    loadNode('root'); // Start with the root node
async function loadNode(nodeId) {
    const response = await fetch(`${nodeId}.json`);
    const nodeData = await response.json();
    renderNode(nodeData);
}

function renderNode(currentNode) {
    const container = document.getElementById('decision-tree');
    const markdownContainer = document.getElementById('markdown-content');
    container.innerHTML = '';

    if (currentNode.markdown) {
        markdownContainer.innerHTML = currentNode.markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    } else {
        markdownContainer.innerHTML = '';
    }
        const questionElem = document.createElement('div');
        questionElem.innerText = currentNode.question;
        questionElem.id = 'question';
        container.appendChild(questionElem);
        if (!currentNode.options && currentNode.nextId) {
            const nextButton = document.createElement('button');
            nextButton.innerText = 'Next';
            nextButton.onclick = () => loadNode(currentNode.nextId);
            container.appendChild(nextButton);
        } else if (currentNode.type === "checkboxes") {
            const form = document.createElement('form');
            form.id = 'checkbox-form';
            currentNode.options.forEach(option => {
                const optionContainer = document.createElement('div');
                optionContainer.classList.add('option-container');

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = option.value;
                input.name = 'options';
                input.value = option.value;

                if (!currentNode.allowMultiple) {
                    input.type = 'radio'; // Change input type to radio for single selection
                }

                const label = document.createElement('label');
                label.classList.add('option-label');
                label.htmlFor = option.value;
                label.innerText = option.text;

                optionContainer.appendChild(input);
                optionContainer.appendChild(label);
                form.appendChild(optionContainer);
            });

            const submitButton = document.createElement('button');
            submitButton.type = 'button'; // Prevent form from actually submitting
            submitButton.innerText = 'Submit';
            submitButton.onclick = () => evaluateSelections(currentNode.next, form);
            form.appendChild(submitButton);

            const backButton = document.createElement('button');
            backButton.type = 'button'; // Prevent form from actually submitting
            backButton.innerText = 'Back';
            if (currentNode.backId) {
                backButton.onclick = () => loadNode(currentNode.backId);
                form.appendChild(backButton);
            }

            container.appendChild(form);
        
    } else if (currentNode.content) {
        container.innerText = currentNode.content;
    }
}

function evaluateSelections(nextNodes, form) {
    const selections = Array.from(form.querySelectorAll('input[name="options"]:checked'))
                            .map(input => input.value);
    
    // Sort selections for consistent comparison with conditions
    const sortedSelections = selections.sort();
    
    // Find a matching node based on the current selections
    const match = nextNodes.find(node => {
        const sortedConditions = [...node.conditions].sort();
        return JSON.stringify(sortedConditions) === JSON.stringify(sortedSelections);
    });

    if (match) {
        loadNode(match.node);
    } else {
        // Handle the case where no exact match is found
        alert("No path matches your selections. Please try again or choose a different set of options.");
    }
}

});
