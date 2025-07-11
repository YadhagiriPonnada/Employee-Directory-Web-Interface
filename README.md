# Employee Directory Web App

A responsive and interactive Employee Directory web interface built with HTML, CSS, and JavaScript. This project demonstrates modern front-end development principles, clean modular code, and user-friendly design. No backend is required; all data is managed in-memory in the browser.

## Features

- **Dashboard Page**: View a grid of employee cards with name, email, department, and role.
- **Add/Edit Employee**: Modal form for adding or editing employees with client-side validation.
- **Delete Employee**: Remove employees from the directory with confirmation.
- **Search**: Search employees by name or email.
- **Filter**: Sidebar to filter by first name, department, or role.
- **Sort**: Sort employees by first name, department, or role.
- **Pagination**: Choose how many employees to show per page and navigate between pages.
- **Responsive Design**: Works well on desktop, tablet, and mobile.
- **No Backend Required**: All data is stored in-memory and resets on page reload.

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Responsive Design)
- Vanilla JavaScript (ES6+)
- [Optional] Freemarker template syntax for server-side rendering (not required for static use)

## Setup & Usage

1. **Clone or Download** this repository to your local machine.
2. **Open `home.html`** in your web browser (double-click or right-click > Open with...)
3. **Use the App**:
   - Add, edit, delete employees
   - Search, filter, sort, and paginate the employee list
   - All changes are in-memory and will reset on page reload

> **Note:** No build tools or server are required. For Freemarker integration, use a Java web server with Freemarker configured.

## File Structure

```
employee-directory/
├── app.js         # Main JavaScript logic (UI, data, validation)
├── home.html      # Main HTML page (UI structure, can use Freemarker)
├── main.css       # Styles for layout, modal, responsive, etc.
└── README.md      # This file
```

## Customization

- **Add More Departments/Roles**: Edit the `<select>` options in `home.html` for department and role in both the filter sidebar and the form.
- **Change Default Employees**: Edit the initial employee card(s) in `home.html`.
- **Styling**: Modify `main.css` for colors, layout, or responsive tweaks.
- **Persistence**: To make data persistent, integrate with a backend or use browser storage (not included).

## Credits

- **Author:** Yadhagiri Ponnada (and contributors)
- **Design & Code:** Modern, clean, and modular front-end best practices

---

Enjoy using and customizing your Employee Directory! 