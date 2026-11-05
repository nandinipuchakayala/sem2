async function loadStudents() {
    const response = await fetch('/students');
    const students = await response.json();

    const list = document.getElementById('studentList');
    list.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = student.studentId;

        const nameCell = document.createElement('td');
        nameCell.textContent = student.studentName;

        const actionsCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';
        editButton.onclick = () => editStudent(student);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => deleteStudent(student._id);

        actionsCell.append(editButton, deleteButton);
        row.append(idCell, nameCell, actionsCell);
        list.appendChild(row);
    });
}

async function addStudent() {
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();

    if (!studentId || !studentName) {
        alert('Please enter both Student ID and Name');
        return;
    }

    const response = await fetch('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, studentName })
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
        document.getElementById('studentId').value = '';
        document.getElementById('studentName').value = '';
        loadStudents();
    }
}

async function editStudent(student) {
    const newName = prompt('Enter new student name:', student.studentName);

    if (newName === null || !newName.trim()) return;

    const response = await fetch('/students/' + student._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: newName.trim() })
    });

    const result = await response.json();
    alert(result.message);
    loadStudents();
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    const response = await fetch('/students/' + id, {
        method: 'DELETE'
    });

    const result = await response.json();
    alert(result.message);
    loadStudents();
}

loadStudents();
