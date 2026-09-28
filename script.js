// State Management
let systemAdmin = JSON.parse(localStorage.getItem('coco_admin')) || {
    name: '',
    position: '',
    password: ''
};

let employees = JSON.parse(localStorage.getItem('coco_employees')) || [];
let departments = JSON.parse(localStorage.getItem('coco_departments')) || [];
let salaryPaidRecords = JSON.parse(localStorage.getItem('coco_salaryPaid')) || [];
let attendanceHistory = JSON.parse(localStorage.getItem('coco_attendanceHistory')) || [];

let currentActiveDeptName = null;

// Page Navigation
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'page2') updateDashboardCounts();
    if (pageId === 'page3') renderEmployeeTable();
    if (pageId === 'page5') renderPayrollTable();
    if (pageId === 'page8') renderDepartmentTable();
    if (pageId === 'page9') renderDepartmentCheckboxes();
    if (pageId === 'page10') renderSalaryPaidTable();
    if (pageId === 'page11') renderAttendanceTable();
    if (pageId === 'page12') loadSettingsPage();
    if (pageId === 'page14') renderAttendanceHistory();
}

// PAGE 1: LOGIN
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('loginName').value;
    const pos = document.getElementById('loginPosition').value;
    const pass = document.getElementById('loginPassword').value;
    const confirmPass = document.getElementById('loginConfirmPassword').value;
    const errorMsg = document.getElementById('loginError');

    if (pass.length !== 5 || isNaN(pass)) {
        errorMsg.innerText = "Password must be exactly 5 digits!";
        return;
    }

    if (pass !== confirmPass) {
        errorMsg.innerText = "Passwords do not match!";
        return;
    }

    if (!systemAdmin.password) {
        // Initial setup
        systemAdmin = { name: name, position: pos, password: pass };
        localStorage.setItem('coco_admin', JSON.stringify(systemAdmin));
    } else {
        if (pass !== systemAdmin.password) {
            errorMsg.innerText = "Incorrect Password!";
            return;
        }
        systemAdmin.name = name;
        systemAdmin.position = pos;
        localStorage.setItem('coco_admin', JSON.stringify(systemAdmin));
    }

    errorMsg.innerText = "";
    document.getElementById('loginForm').reset();
    navigateTo('page2');
});

function logout() {
    navigateTo('page1');
}

// DASHBOARD COUNTS
function updateDashboardCounts() {
    document.getElementById('dashEmpCount').innerText = employees.length;
}

// PAGE 3: EMPLOYEES LIST
function renderEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = "";

    employees.forEach((emp, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td><a href="#" style="color:var(--gold); font-weight:bold;" onclick="viewEmployeeDetail('${emp.id}')">${emp.name}</a></td>
                <td>${emp.gender}</td>
                <td>${emp.department || 'Unassigned'}</td>
                <td>${emp.position || 'N/A'}</td>
                <td>${emp.phone}</td>
                <td>
                    <button onclick="editEmployee(${index})" style="color:var(--success); background:none; border:none; cursor:pointer; margin-right:10px;"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button onclick="deleteEmployee(${index})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });
}

function openNewEmpForm() {
    document.getElementById('empEditIndex').value = "";
    document.getElementById('empId').value = "";
    document.getElementById('empName').value = "";
    document.getElementById('empDob').value = "";
    document.getElementById('empPhone').value = "";
    document.getElementById('empAddress').value = "";
    document.getElementById('empFormTitle').innerText = "Add New Employee";
    navigateTo('page4');
}

// PAGE 4: SAVE EMPLOYEE
function saveEmployee() {
    const editIdx = document.getElementById('empEditIndex').value;
    const empId = document.getElementById('empId').value;
    const empName = document.getElementById('empName').value;
    const empGender = document.getElementById('empGender').value;
    const empDob = document.getElementById('empDob').value;
    const empPhone = document.getElementById('empPhone').value;
    const empAddress = document.getElementById('empAddress').value;

    if (!empId || !empName) {
        alert("Please fill required fields!");
        return;
    }

    if (editIdx !== "") {
        employees[editIdx] = {
            ...employees[editIdx],
            id: empId, name: empName, gender: empGender, dob: empDob, phone: empPhone, address: empAddress
        };
    } else {
        const newEmp = {
            id: empId,
            name: empName,
            gender: empGender,
            dob: empDob,
            phone: empPhone,
            address: empAddress,
            department: 'Unassigned',
            position: 'Staff',
            todayAttendance: 'Present (P)'
        };
        employees.push(newEmp);
    }

    localStorage.setItem('coco_employees', JSON.stringify(employees));
    navigateTo('page3');
}

function editEmployee(index) {
    const emp = employees[index];
    document.getElementById('empEditIndex').value = index;
    document.getElementById('empId').value = emp.id;
    document.getElementById('empName').value = emp.name;
    document.getElementById('empGender').value = emp.gender;
    document.getElementById('empDob').value = emp.dob;
    document.getElementById('empPhone').value = emp.phone;
    document.getElementById('empAddress').value = emp.address;
    document.getElementById('empFormTitle').innerText = "Edit Employee Information";
    navigateTo('page4');
}

function deleteEmployee(index) {
    if (confirm("Are you sure you want to delete this employee?")) {
        employees.splice(index, 1);
        localStorage.setItem('coco_employees', JSON.stringify(employees));
        renderEmployeeTable();
    }
}

// PAGE 7: DETAILS VIEW
function viewEmployeeDetail(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('detailEmpIdHidden').value = emp.id;
    document.getElementById('detailId').value = emp.id;
    document.getElementById('detailName').value = emp.name;
    document.getElementById('detailGender').value = emp.gender;
    document.getElementById('detailDob').value = emp.dob;
    document.getElementById('detailPhone').value = emp.phone;
    document.getElementById('detailAddress').value = emp.address;

    navigateTo('page7');
}

function updatePersonalDetails() {
    const id = document.getElementById('detailEmpIdHidden').value;
    const emp = employees.find(e => e.id === id);

    if (emp) {
        emp.name = document.getElementById('detailName').value;
        emp.gender = document.getElementById('detailGender').value;
        emp.dob = document.getElementById('detailDob').value;
        emp.phone = document.getElementById('detailPhone').value;
        emp.address = document.getElementById('detailAddress').value;

        localStorage.setItem('coco_employees', JSON.stringify(employees));
        alert("Employee details updated successfully!");
        navigateTo('page3');
    }
}

// PAGE 5: SALARY PAYROLL
function renderPayrollTable() {
    const tbody = document.getElementById('payrollTableBody');
    tbody.innerHTML = "";

    employees.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.position || 'N/A'}</td>
                <td>${emp.phone}</td>
                <td>
                    <button onclick="openSalaryCalculator('${emp.id}')" class="btn-gold-secondary">
                        <i class="fa-solid fa-calculator"></i> Calculate Payroll
                    </button>
                </td>
            </tr>
        `;
    });
}

// PAGE 6: SALARY CALCULATION
function openSalaryCalculator(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('calcEmpId').value = emp.id;
    document.getElementById('calcEmpName').value = emp.name;
    document.getElementById('calcPosition').value = emp.position || 'N/A';
    document.getElementById('calcAttendance').value = emp.todayAttendance || 'Present (P)';

    document.getElementById('basicSalary').value = 0;
    document.getElementById('allowance').value = 0;
    document.getElementById('overtime').value = 0;
    document.getElementById('deduction').value = 0;

    calculateSalary();
    navigateTo('page6');
}

function calculateSalary() {
    const empId = document.getElementById('calcEmpId').value;
    const empName = document.getElementById('calcEmpName').value;
    const pos = document.getElementById('calcPosition').value;
    const att = document.getElementById('calcAttendance').value;

    const basic = parseFloat(document.getElementById('basicSalary').value) || 0;
    const allowance = parseFloat(document.getElementById('allowance').value) || 0;
    const ot = parseFloat(document.getElementById('overtime').value) || 0;
    const deduction = parseFloat(document.getElementById('deduction').value) || 0;

    const netSalary = (basic + allowance + ot) - deduction;

    document.getElementById('voucherDate').innerText = new Date().toLocaleString();
    document.getElementById('vEmpId').innerText = empId;
    document.getElementById('vEmpName').innerText = empName;
    document.getElementById('vPosition').innerText = pos;
    document.getElementById('vAttendance').innerText = att;
    document.getElementById('vBasic').innerText = `$${basic.toFixed(2)}`;
    document.getElementById('vAllowance').innerText = `$${allowance.toFixed(2)}`;
    document.getElementById('vOT').innerText = `$${ot.toFixed(2)}`;
    document.getElementById('vDeduction').innerText = `-$${deduction.toFixed(2)}`;
    document.getElementById('vNetSalary').innerText = `$${netSalary.toFixed(2)}`;
}

function saveSalaryToPage10() {
    const empId = document.getElementById('calcEmpId').value;
    const empName = document.getElementById('calcEmpName').value;
    const pos = document.getElementById('calcPosition').value;
    const netSalary = document.getElementById('vNetSalary').innerText;

    const voucherHtml = document.getElementById('voucherPrintArea').innerHTML;

    const record = {
        empId: empId,
        empName: empName,
        position: pos,
        date: new Date().toLocaleString(),
        netSalary: netSalary,
        voucherTemplate: voucherHtml
    };

    salaryPaidRecords.push(record);
    localStorage.setItem('coco_salaryPaid', JSON.stringify(salaryPaidRecords));

    alert("Salary Voucher successfully saved to Page 10!");
    navigateTo('page10');
}

function printVoucher() {
    window.print();
}

// PAGE 8 & 9: DEPARTMENTS
function renderDepartmentTable() {
    const tbody = document.getElementById('departmentTableBody');
    tbody.innerHTML = "";

    departments.forEach((dept, index) => {
        tbody.innerHTML += `
            <tr>
                <td><a href="#" style="color:var(--gold); font-weight:bold;" onclick="openDeptPositionPage('${dept.name}')">${dept.name}</a></td>
                <td>${dept.employees.length} Employee(s)</td>
                <td>
                    <button onclick="deleteDepartment(${index})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });
}

function renderDepartmentCheckboxes() {
    const container = document.getElementById('deptEmpCheckboxList');
    container.innerHTML = "";

    employees.forEach(emp => {
        container.innerHTML += `
            <div class="checkbox-item">
                <input type="checkbox" value="${emp.id}" id="chk_${emp.id}">
                <label for="chk_${emp.id}">${emp.name} (${emp.id})</label>
            </div>
        `;
    });
}

function saveDepartment() {
    const deptName = document.getElementById('deptNameInput').value;
    if (!deptName) {
        alert("Please enter department name!");
        return;
    }

    const assignedIds = [];
    employees.forEach(emp => {
        const chk = document.getElementById(`chk_${emp.id}`);
        if (chk && chk.checked) {
            assignedIds.push(emp.id);
            emp.department = deptName;
        }
    });

    departments.push({ name: deptName, employees: assignedIds });
    localStorage.setItem('coco_departments', JSON.stringify(departments));
    localStorage.setItem('coco_employees', JSON.stringify(employees));

    document.getElementById('deptNameInput').value = "";
    navigateTo('page8');
}

function deleteDepartment(index) {
    const deptName = departments[index].name;
    if (confirm(`Delete department ${deptName}?`)) {
        departments.splice(index, 1);
        employees.forEach(emp => {
            if (emp.department === deptName) emp.department = 'Unassigned';
        });
        localStorage.setItem('coco_departments', JSON.stringify(departments));
        localStorage.setItem('coco_employees', JSON.stringify(employees));
        renderDepartmentTable();
    }
}

// PAGE 13: ASSIGN POSITIONS
function openDeptPositionPage(deptName) {
    currentActiveDeptName = deptName;
    document.getElementById('page13DeptTitle').innerText = `Department: ${deptName} (Assign Positions)`;

    const tbody = document.getElementById('deptPosTableBody');
    tbody.innerHTML = "";

    const deptEmps = employees.filter(e => e.department === deptName);

    deptEmps.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>
                    <input type="text" id="pos_input_${emp.id}" value="${emp.position || ''}" placeholder="e.g. Senior Developer">
                </td>
            </tr>
        `;
    });

    navigateTo('page13');
}

function saveDepartmentPositions() {
    const deptEmps = employees.filter(e => e.department === currentActiveDeptName);

    deptEmps.forEach(emp => {
        const inputVal = document.getElementById(`pos_input_${emp.id}`).value;
        emp.position = inputVal;
    });

    localStorage.setItem('coco_employees', JSON.stringify(employees));
    alert("Positions updated successfully!");
    navigateTo('page3');
}

// PAGE 10: SALARY PAID RECORDS
function renderSalaryPaidTable() {
    const tbody = document.getElementById('paidSalaryTableBody');
    tbody.innerHTML = "";

    salaryPaidRecords.forEach((rec, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${rec.empId}</td>
                <td><a href="#" style="color:var(--gold); font-weight:bold;" onclick="reprintVoucherModal(${index})">${rec.empName}</a></td>
                <td>${rec.position || 'N/A'}</td>
                <td>${rec.date}</td>
                <td><strong style="color:var(--success);">${rec.netSalary}</strong></td>
                <td>
                    <button onclick="deleteSalaryRecord(${index})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteSalaryRecord(index) {
    if (confirm("Delete this paid salary record?")) {
        salaryPaidRecords.splice(index, 1);
        localStorage.setItem('coco_salaryPaid', JSON.stringify(salaryPaidRecords));
        renderSalaryPaidTable();
    }
}

function reprintVoucherModal(index) {
    const rec = salaryPaidRecords[index];
    const modalArea = document.getElementById('reprintVoucherArea');
    modalArea.innerHTML = rec.voucherTemplate;

    // Remove action buttons inside modal
    const btns = modalArea.querySelector('.voucher-actions');
    if (btns) btns.style.display = 'none';

    document.getElementById('voucherModal').style.display = 'flex';
}

function closeVoucherModal() {
    document.getElementById('voucherModal').style.display = 'none';
}

// PAGE 11 & 14: ATTENDANCE
function renderAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = "";

    employees.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.position || 'N/A'}</td>
                <td><strong style="color:var(--gold);">${emp.todayAttendance || 'Present (P)'}</strong></td>
                <td>
                    <button onclick="setTodayAttendance('${emp.id}', 'Present (P)')" class="btn-att btn-p">P</button>
                    <button onclick="setTodayAttendance('${emp.id}', 'Absent (A)')" class="btn-att btn-a">A</button>
                    <button onclick="setTodayAttendance('${emp.id}', 'Leave (L)')" class="btn-att btn-l">Leave</button>
                </td>
            </tr>
        `;
    });
}

function setTodayAttendance(empId, status) {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
        emp.todayAttendance = status;
        localStorage.setItem('coco_employees', JSON.stringify(employees));
        renderAttendanceTable();
    }
}

function submitTodayAttendance() {
    const todayDate = new Date().toLocaleDateString();

    employees.forEach(emp => {
        attendanceHistory.push({
            date: todayDate,
            empId: emp.id,
            name: emp.name,
            status: emp.todayAttendance || 'Present (P)'
        });
    });

    localStorage.setItem('coco_attendanceHistory', JSON.stringify(attendanceHistory));
    alert("Today's Attendance successfully logged to History!");
    navigateTo('page14');
}

function renderAttendanceHistory() {
    const tbody = document.getElementById('attendanceHistoryTableBody');
    tbody.innerHTML = "";

    attendanceHistory.forEach((log, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${log.date}</td>
                <td>${log.empId}</td>
                <td>${log.name}</td>
                <td>${log.status}</td>
                <td>
                    <button onclick="repairAttendance(${index})" style="color:var(--success); background:none; border:none; cursor:pointer; margin-right:8px;"><i class="fa-solid fa-wrench"></i> Repair</button>
                    <button onclick="deleteAttendanceLog(${index})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });
}

function repairAttendance(index) {
    const newStatus = prompt("Enter new status (Present (P) / Absent (A) / Leave (L)):", attendanceHistory[index].status);
    if (newStatus) {
        attendanceHistory[index].status = newStatus;
        localStorage.setItem('coco_attendanceHistory', JSON.stringify(attendanceHistory));
        renderAttendanceHistory();
    }
}

function deleteAttendanceLog(index) {
    if (confirm("Delete this history record?")) {
        attendanceHistory.splice(index, 1);
        localStorage.setItem('coco_attendanceHistory', JSON.stringify(attendanceHistory));
        renderAttendanceHistory();
    }
}

// PAGE 12: SETTINGS
function loadSettingsPage() {
    document.getElementById('settingName').value = systemAdmin.name || 'N/A';
    document.getElementById('settingPosition').value = systemAdmin.position || 'N/A';
    document.getElementById('settingPasswordShow').value = systemAdmin.password || 'Not Set';
}

function updateSystemPassword() {
    const newPass = document.getElementById('newPassInput').value;
    if (newPass.length !== 5 || isNaN(newPass)) {
        alert("Password must be exactly 5 digits!");
        return;
    }

    systemAdmin.password = newPass;
    localStorage.setItem('coco_admin', JSON.stringify(systemAdmin));
    alert("Password updated successfully!");
    document.getElementById('newPassInput').value = "";
    loadSettingsPage();
}


