const renderAssignment = assignment => {};

// const assignObject = (acc, keys, obj) => {

// };

// const transformResults = results => {
//   const assertions = results.testResults[0].assertionResults;
//   return assertions.reduce((acc, assertion) => {
//     const describes = assertion.ancestorTitles;
//     const passed = assertion.status === 'passed';
//     const title = assertion.title;
//     const failureDetails = assertion.failureDetails[0] || {};
//     const {actual, expected} = failureDetails.matcherResult || {};
//     return assignObject(acc, describes, {title, passed, actual, expected});
//   }, {});
// };

const toggleView = element => {
  console.log(element);
  const children = Array.from(element.children).slice(1);
  children.forEach(child => {
    if (Array.from(child.classList).includes('hide')) {
      child.classList.remove('hide');
    } else {
      child.classList.add('hide');
    }
  });
  // element.children[1].classList.remove('hide');
};

const renderTest = test => {
  const describes = test.ancestorTitles;
  const passed = test.status === 'passed';
  const indents = [0, 25, 50];

  let parent = document.querySelector('#results');
  describes.forEach((describe, index) => {
    let element = document.querySelector(`#${parent.id}-${describe}`);
    if (!element) {
      const indentation = `${indents[index % describes.length]}px`;
      element = document.createElement('div');
      element.id = `${parent.id}-${describe}`;
      const titleContainer = document.createElement('div');
      titleContainer.addEventListener('click', () => toggleView(element));
      titleContainer.classList.add(
        index % 2 === 0 ? 'title-container-even' : 'title-container-odd'
      );
      const img = document.createElement('img');
      img.style = `margin-left: ${indentation};`;
      const title = document.createElement('p');
      title.innerText = ` ${describe}`;
      title.classList.add('title');
      titleContainer.append(img);
      titleContainer.append(title);
      element.append(titleContainer);
      parent.append(element);
    }
    const img = element.children[0].children[0];
    img.src =
      !img.src.includes('failed') && passed
        ? `images/passed.png`
        : 'images/failed.png';
    if (index !== 0) {
      element.classList.add('hide');
    }
    parent = element;
  });

  const testElement = document.createElement('div');
  testElement.className = passed ? 'test-passed hide' : 'test-failed hide';
  const descriptionContainer = document.createElement('div');
  const img = document.createElement('img');
  img.src = passed ? `images/passed.png` : 'images/failed.png';
  const description = document.createElement('p');
  description.className = 'test-description';
  description.innerText = `${test.title}`;
  if (!passed) {
    const {expected, actual} = test.failureDetails[0].matcherResult;
    description.innerText += `\n\nExpected: ${JSON.stringify(
      expected
    )} \n Received: ${JSON.stringify(actual)}`;
  }
  testElement.style = `padding-left: ${
    indents[describes.length - 1] + 25
  }px; border-bottom: 1px solid #dad8da;`;
  descriptionContainer.className = 'test';
  descriptionContainer.append(img, description);
  testElement.append(descriptionContainer);
  parent.append(testElement);
};

const renderAssignments = async () => {
  const results = await fetch('/results.json').then(res => res.json());
  results.testResults[0].testResults.forEach(test => {
    renderTest(test);
  });
};

window.onload = renderAssignments;
