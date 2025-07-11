
let employees = window.employees || [];
let filteredEmployees = [...employees];
let currentPage = 1;
let pageSize = 10;
let sortBy = 'firstName';
let searchQuery = '';
let filter = { firstName: '', department: '', role: '' };

// --- DOM Elements ---
const employeeList = document.getElementById('employee-list');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const employeeModal = document.getElementById('employee-modal');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const formErrors = document.getElementById('form-errors');
const cancelEmployeeBtn = document.getElementById('cancel-employee-btn');
const searchBar = document.getElementById('search-bar');
const sortBySelect = document.getElementById('sort-by');
const pageSizeSelect = document.getElementById('page-size');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const pageInfo = document.getElementById('page-info');
const filterBtn = document.getElementById('filter-btn');
const filterSidebar = document.getElementById('filter-sidebar');
const closeFilterBtn = document.getElementById('close-filter-btn');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const filterFirstName = document.getElementById('filter-firstname');
const filterDepartment = document.getElementById('filter-department');
const filterRole = document.getElementById('filter-role');

// --- Utility Functions ---
function resetForm() {
  employeeForm.reset();
  formErrors.classList.add('hidden');
  formErrors.textContent = '';
  // Remove any data attribute for edit tracking
  employeeForm.removeAttribute('data-edit-email');
}
function showModal(edit = false, emp = null) {
  resetForm();
  if (edit && emp) {
    modalTitle.textContent = 'Edit Employee';
    document.getElementById('first-name').value = emp.firstName;
    document.getElementById('last-name').value = emp.lastName;
    document.getElementById('email').value = emp.email;
    document.getElementById('department').value = emp.department;
    document.getElementById('role').value = emp.role;
    // Store email as unique key for editing
    employeeForm.setAttribute('data-edit-email', emp.email);
  } else {
    modalTitle.textContent = 'Add Employee';
  }
  employeeModal.classList.remove('hidden');
}
function closeModal() {
  employeeModal.classList.add('hidden');
}
function validateForm() {
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const department = document.getElementById('department').value;
  const role = document.getElementById('role').value;
  let errors = [];
  if (!firstName) errors.push('First Name is required.');
  if (!lastName) errors.push('Last Name is required.');
  if (!email) errors.push('Email is required.');
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Invalid email format.');
  if (!department) errors.push('Department is required.');
  if (!role) errors.push('Role is required.');
  if (errors.length) {
    formErrors.textContent = errors.join(' ');
    formErrors.classList.remove('hidden');
    return false;
  }
  formErrors.classList.add('hidden');
  return true;
}
function getFormData() {
  return {
    firstName: document.getElementById('first-name').value.trim(),
    lastName: document.getElementById('last-name').value.trim(),
    email: document.getElementById('email').value.trim(),
    department: document.getElementById('department').value,
    role: document.getElementById('role').value
  };
}

// --- Render Functions ---
function renderEmployees() {
  // Filtering, searching, sorting, and pagination
  let list = employees.filter(emp => {
    // Search
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      emp.firstName.toLowerCase().includes(search) ||
      emp.lastName.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search);
    // Filter
    const matchesFirstName = !filter.firstName || emp.firstName.toLowerCase().includes(filter.firstName.toLowerCase());
    const matchesDepartment = !filter.department || emp.department === filter.department;
    const matchesRole = !filter.role || emp.role === filter.role;
    return matchesSearch && matchesFirstName && matchesDepartment && matchesRole;
  });
  // Sort
  list.sort((a, b) => {
    if (sortBy === 'firstName') return a.firstName.localeCompare(b.firstName);
    if (sortBy === 'role') return a.role.localeCompare(b.role);
    if (sortBy === 'department') return a.department.localeCompare(b.department);
    return 0;
  });
  // Pagination
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageList = list.slice(start, end);
  // Render
  employeeList.innerHTML = '';
  if (!pageList.length) {
    employeeList.innerHTML = '<p>No employees found.</p>';
  } else {
    pageList.forEach(emp => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.setAttribute('data-email', emp.email);
      card.innerHTML = `
        <h3>${emp.firstName} ${emp.lastName}</h3>
        <p><strong>Email:</strong> ${emp.email}</p>
        <p><strong>Department:</strong> ${emp.department}</p>
        <p><strong>Role:</strong> ${emp.role}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;
      // Edit button
      card.querySelector('.edit-btn').onclick = () => {
        showModal(true, emp);
      };
      // Delete button
      card.querySelector('.delete-btn').onclick = () => {
        if (confirm('Are you sure you want to delete this employee?')) {
          employees = employees.filter(e => e.email !== emp.email);
          renderEmployees();
        }
      };
      employeeList.appendChild(card);
    });
  }
  // Update pagination info
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

// --- Event Listeners ---
addEmployeeBtn.onclick = () => showModal(false);
cancelEmployeeBtn.onclick = closeModal;
employeeModal.onclick = (e) => { if (e.target === employeeModal) closeModal(); };
employeeForm.onsubmit = function(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const data = getFormData();
  const editEmail = employeeForm.getAttribute('data-edit-email');
  if (editEmail) {
    // Edit: find by email and update
    const idx = employees.findIndex(e => e.email === editEmail);
    if (idx !== -1) {
      employees[idx] = data;
    }
  } else {
    // Add: check for duplicate email
    if (employees.some(e => e.email === data.email)) {
      formErrors.textContent = 'An employee with this email already exists.';
      formErrors.classList.remove('hidden');
      return;
    }
    employees.push(data);
  }
  closeModal();
  renderEmployees();
};
searchBar.oninput = function() {
  searchQuery = this.value;
  currentPage = 1;
  renderEmployees();
};
sortBySelect.onchange = function() {
  sortBy = this.value;
  renderEmployees();
};
pageSizeSelect.onchange = function() {
  pageSize = Number(this.value);
  currentPage = 1;
  renderEmployees();
};
prevPageBtn.onclick = function() {
  if (currentPage > 1) {
    currentPage--;
    renderEmployees();
  }
};
nextPageBtn.onclick = function() {
  // Recalculate total after filters/search
  let list = employees.filter(emp => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      emp.firstName.toLowerCase().includes(search) ||
      emp.lastName.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search);
    const matchesFirstName = !filter.firstName || emp.firstName.toLowerCase().includes(filter.firstName.toLowerCase());
    const matchesDepartment = !filter.department || emp.department === filter.department;
    const matchesRole = !filter.role || emp.role === filter.role;
    return matchesSearch && matchesFirstName && matchesDepartment && matchesRole;
  });
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  if (currentPage < totalPages) {
    currentPage++;
    renderEmployees();
  }
};
// Filter sidebar logic
filterBtn.onclick = function() {
  filterSidebar.classList.remove('hidden');
};
closeFilterBtn.onclick = function() {
  filterSidebar.classList.add('hidden');
};
applyFiltersBtn.onclick = function() {
  filter.firstName = filterFirstName.value.trim();
  filter.department = filterDepartment.value;
  filter.role = filterRole.value;
  currentPage = 1;
  filterSidebar.classList.add('hidden');
  renderEmployees();
};

// --- Initialization ---
// If Freemarker injected employees, use them
if (typeof employees === 'undefined' || !employees.length) {
  // Try to read from DOM (if rendered by Freemarker)
  employees = [];
  document.querySelectorAll('.student-card').forEach(card => {
    employees.push({
      firstName: card.querySelector('h3').textContent.split(' ')[0],
      lastName: card.querySelector('h3').textContent.split(' ')[1],
      email: card.querySelector('p:nth-of-type(1)').textContent.replace('Email:', '').trim(),
      department: card.querySelector('p:nth-of-type(2)').textContent.replace('Department:', '').trim(),
      role: card.querySelector('p:nth-of-type(3)').textContent.replace('Role:', '').trim(),
    });
  });
}
renderEmployees();
