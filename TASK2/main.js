// Sample data for projects
const projects = [
    { id: 1, name: "Project A", status: "In Progress" },
    { id: 2, name: "Project B", status: "Completed" },
    // Add more projects here
];

// Function to display projects
function displayProjects() {
    const projectList = document.querySelector('#project-list');
    projectList.innerHTML = '';

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        projectItem.innerHTML = `
            <h3>${project.name}</h3>
            <p>Status: ${project.status}</p>
        `;
        projectList.appendChild(projectItem);
    });
}

// Call displayProjects when the page loads
window.addEventListener('DOMContentLoaded', displayProjects);