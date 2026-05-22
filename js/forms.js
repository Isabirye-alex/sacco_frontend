// Form Builders

export function createDepositForm(accounts) {
    const container = document.createElement('div');

    const accountSelect = createSelect('account', 'Select Account',
        accounts.map(acc => ({
            value: acc.id,
            label: `${acc.name || 'Account'} - ${acc.account_no} (Balance: ${formatCurrency(acc.balance || 0)})`
        }))
    );

    const amountInput = createInput('amount', 'Amount (UGX)', 'number', '0', {
        min: '0',
        step: '1000',
        placeholder: 'Enter amount'
    });

    const descriptionInput = createInput('description', 'Description (Optional)', 'text', '', {
        placeholder: 'e.g., Monthly savings'
    });

    container.appendChild(createFormGroup('Account', accountSelect));
    container.appendChild(createFormGroup('Amount', amountInput));
    container.appendChild(createFormGroup('Description', descriptionInput));

    return {
        element: container, getFormData: () => ({
            accountId: accountSelect.value,
            amount: amountInput.value,
            description: descriptionInput.value
        })
    };
}

export function createWithdrawForm(accounts) {
    const container = document.createElement('div');

    const accountSelect = createSelect('account', 'Select Account',
        accounts.map(acc => ({
            value: acc.id,
            label: `${acc.name || 'Account'} - ${acc.account_no} (Balance: ${formatCurrency(acc.balance || 0)})`
        }))
    );

    const amountInput = createInput('amount', 'Amount (UGX)', 'number', '0', {
        min: '0',
        step: '1000',
        placeholder: 'Enter amount'
    });

    const descriptionInput = createInput('description', 'Description (Optional)', 'text', '', {
        placeholder: 'e.g., Emergency withdrawal'
    });

    container.appendChild(createFormGroup('Account', accountSelect));
    container.appendChild(createFormGroup('Amount', amountInput));
    container.appendChild(createFormGroup('Description', descriptionInput));

    return {
        element: container, getFormData: () => ({
            accountId: accountSelect.value,
            amount: amountInput.value,
            description: descriptionInput.value
        })
    };
}

export function createTransferForm(accounts) {
    const container = document.createElement('div');

    const fromSelect = createSelect('from', 'From Account',
        accounts.map(acc => ({
            value: acc.id,
            label: `${acc.name || 'Account'} - ${acc.account_no} (Balance: ${formatCurrency(acc.balance || 0)})`
        }))
    );

    const toMemberInput = createInput('toMember', 'To Member ID/Number', 'text', '', {
        placeholder: 'Enter member number'
    });

    const amountInput = createInput('amount', 'Amount (UGX)', 'number', '0', {
        min: '0',
        step: '1000'
    });

    const descriptionInput = createInput('description', 'Description', 'text', '', {
        placeholder: 'e.g., Personal transfer'
    });

    container.appendChild(createFormGroup('From Account', fromSelect));
    container.appendChild(createFormGroup('To Member ID', toMemberInput));
    container.appendChild(createFormGroup('Amount', amountInput));
    container.appendChild(createFormGroup('Description', descriptionInput));

    return {
        element: container, getFormData: () => ({
            fromAccountId: fromSelect.value,
            toMemberId: toMemberInput.value,
            amount: amountInput.value,
            description: descriptionInput.value
        })
    };
}

export function createLoanApplicationForm(products) {
    const container = document.createElement('div');

    const productSelect = createSelect('product', 'Select Loan Product',
        products.map(prod => ({
            value: prod.id,
            label: `${prod.product_name || prod.name} (Rate: ${prod.interest_rate_pa || 0}% p.a.)`
        }))
    );

    const amountInput = createInput('amount', 'Loan Amount (UGX)', 'number', '0', {
        min: '0',
        step: '10000',
        placeholder: 'Enter desired amount'
    });

    const purposeInput = createInput('purpose', 'Purpose of Loan', 'text', '', {
        placeholder: 'e.g., Business expansion'
    });

    const guarantorsInput = createInput('guarantors', 'Number of Guarantors', 'number', '1', {
        min: '0',
        max: '5'
    });

    container.appendChild(createFormGroup('Loan Product', productSelect));
    container.appendChild(createFormGroup('Loan Amount', amountInput));
    container.appendChild(createFormGroup('Purpose', purposeInput));
    container.appendChild(createFormGroup('Number of Guarantors', guarantorsInput));

    const noteEl = document.createElement('p');
    noteEl.style.cssText = 'font-size: 12px; color: #999; margin-top: 12px;';
    noteEl.textContent = 'We will contact you with guarantor details form after submission.';
    container.appendChild(noteEl);

    return {
        element: container, getFormData: () => ({
            productId: productSelect.value,
            amount: amountInput.value,
            purpose: purposeInput.value,
            guarantorCount: parseInt(guarantorsInput.value) || 1
        })
    };
}

export function createLoanPaymentForm(loans) {
    const container = document.createElement('div');

    if (!loans || loans.length === 0) {
        container.innerHTML = '<p style="color: #666;">No active loans found.</p>';
        return { element: container, getFormData: () => ({}) };
    }

    const loanSelect = createSelect('loan', 'Select Loan',
        loans.map(loan => ({
            value: loan.id,
            label: `${loan.product?.product_name || 'Loan'} - Outstanding: ${formatCurrency(loan.outstanding_balance || 0)}`
        }))
    );

    const amountInput = createInput('amount', 'Payment Amount (UGX)', 'number', '0', {
        min: '0',
        step: '1000',
        placeholder: 'Enter payment amount'
    });

    const methodSelect = createSelect('method', 'Payment Method', [
        { value: 'cash', label: 'Cash' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'check', label: 'Cheque' }
    ]);

    const referenceInput = createInput('reference', 'Payment Reference (Optional)', 'text', '', {
        placeholder: 'e.g., Cheque number or transaction ID'
    });

    container.appendChild(createFormGroup('Loan', loanSelect));
    container.appendChild(createFormGroup('Payment Amount', amountInput));
    container.appendChild(createFormGroup('Payment Method', methodSelect));
    container.appendChild(createFormGroup('Reference', referenceInput));

    return {
        element: container, getFormData: () => ({
            loanId: loanSelect.value,
            amount: amountInput.value,
            paymentMethod: methodSelect.value,
            reference: referenceInput.value
        })
    };
}

export function createEditProfileForm(memberData) {
    const container = document.createElement('div');

    const firstNameInput = createInput('firstName', 'First Name', 'text', memberData.first_name || '');
    const middleNameInput = createInput('middleName', 'Middle Name', 'text', memberData.middle_name || '');
    const lastNameInput = createInput('lastName', 'Last Name', 'text', memberData.last_name || '');
    const emailInput = createInput('email', 'Email', 'email', memberData.email || '');
    const phoneInput = createInput('phone', 'Phone Primary', 'tel', memberData.phone_primary || '');
    const addressInput = createInput('address', 'Physical Address', 'text', memberData.physical_address || '');

    container.appendChild(createFormGroup('First Name', firstNameInput));
    container.appendChild(createFormGroup('Middle Name', middleNameInput));
    container.appendChild(createFormGroup('Last Name', lastNameInput));
    container.appendChild(createFormGroup('Email', emailInput));
    container.appendChild(createFormGroup('Phone', phoneInput));
    container.appendChild(createFormGroup('Address', addressInput));

    return {
        element: container, getFormData: () => ({
            first_name: firstNameInput.value,
            middle_name: middleNameInput.value,
            last_name: lastNameInput.value,
            email: emailInput.value,
            phone_primary: phoneInput.value,
            physical_address: addressInput.value
        })
    };
}

// Authentication Forms

export function createLoginForm() {
    const container = document.createElement('div');

    const emailInput = createInput('email', 'Email Address', 'email', '', {
        required: 'true'
    });

    const passwordInput = createInput('password', 'Password', 'password', '', {
        required: 'true'
    });

    container.appendChild(createFormGroup('Email', emailInput));
    container.appendChild(createFormGroup('Password', passwordInput));

    return {
        element: container,
        getFormData: () => ({
            email: emailInput.value,
            password: passwordInput.value
        })
    };
}

export function createRegisterForm({ branches = [], genders = [], statuses = [], maritalStatuses = [] } = {}) {
    const container = document.createElement('div');

    // Inline helper to generate dropdown select elements dynamically
    const createSelect = (id, labelText, optionsList, isOptional = false) => {
        const select = document.createElement('select');
        select.id = id;
        select.name = id;
        select.className = 'form-select';
        if (!isOptional) select.setAttribute('required', 'true');

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = `-- Select ${labelText} --`;
        select.appendChild(placeholder);

        if (Array.isArray(optionsList)) {
            optionsList.forEach(item => {
                const option = document.createElement('option');

                // Consistently use 'id' across all tables for the UUID value
                option.value = item.id || '';

                // Route the custom human-readable text column labels safely
                if (id === 'branch_id') {
                    option.textContent = item.branch_name;
                } else if (id === 'gender_id') {
                    option.textContent = item.gender;
                } else if (id === 'marital_status_id') {
                    option.textContent = item.status;
                } else {
                    // Fallback for status_id or any alternative dynamic tables
                    option.textContent = item.status || item.name || 'Unknown';
                }

                select.appendChild(option);
            });
        }

        return select;
    };

    // --- REQUIRED FIELDS ---
    const firstNameInput = createInput('first_name', 'First Name', 'text', '', { required: 'true' });
    const lastNameInput = createInput('last_name', 'Last Name', 'text', '', { required: 'true' });

    // Dynamic Dropdown Fields (Required)
    const branchSelect = createSelect('branch_id', 'Branch', branches, false);
    const genderSelect = createSelect('gender_id', 'Gender', genders, false);

    // --- OPTIONAL FIELDS ---
    const middleNameInput = createInput('middle_name', 'Middle Name (Optional)', 'text', '');
    const emailInput = createInput('email', 'Email Address (Optional)', 'email', '');
    
    const dobInput = createInput('date_of_birth', 'Date of Birth (Optional)', 'date', '');
    const nationalIdInput = createInput('national_id', 'National ID (Optional)', 'text', '');

    // Dynamic Dropdown Field (Optional)
    const maritalStatusSelect = createSelect('marital_status_id', 'Marital Status', maritalStatuses, true);

    const phonePrimaryInput = createInput('phone_primary', 'Primary Phone (Optional)', 'tel', '');
    const phoneSecondaryInput = createInput('phone_secondary', 'Secondary Phone (Optional)', 'tel', '');
    const countryInput = createInput('country', 'Country (Optional)', 'text', '');
    const districtInput = createInput('district', 'District (Optional)', 'text', '');
    const villageInput = createInput('village', 'Village (Optional)', 'text', '');

    // --- APPENDING TO CONTAINER ---
    // Required Sections
    container.appendChild(createFormGroup('First Name', firstNameInput));
    container.appendChild(createFormGroup('Middle Name (Optional)', middleNameInput));
    container.appendChild(createFormGroup('Last Name', lastNameInput));
    container.appendChild(createFormGroup('Branch', branchSelect));
    container.appendChild(createFormGroup('Gender', genderSelect));

    // Optional Sections
    container.appendChild(createFormGroup('Email Address (Optional)', emailInput));
    
    container.appendChild(createFormGroup('Date of Birth (Optional)', dobInput));
    container.appendChild(createFormGroup('National ID (Optional)', nationalIdInput));
    container.appendChild(createFormGroup('Marital Status (Optional)', maritalStatusSelect));
    container.appendChild(createFormGroup('Primary Phone (Optional)', phonePrimaryInput));
    container.appendChild(createFormGroup('Secondary Phone (Optional)', phoneSecondaryInput));
    container.appendChild(createFormGroup('Country (Optional)', countryInput));
    container.appendChild(createFormGroup('District (Optional)', districtInput));
    container.appendChild(createFormGroup('Village (Optional)', villageInput));

    return {
        element: container,
        getFormData: () => {
            const valueOrNull = (input) => input.value.trim() === '' ? null : input.value;

            return {
                first_name: firstNameInput.value,
                middle_name: valueOrNull(middleNameInput),
                last_name: lastNameInput.value,
                email: valueOrNull(emailInput),

                branch_id: branchSelect.value === '' ? null : branchSelect.value,
                gender_id: genderSelect.value === '' ? null : genderSelect.value,

                date_of_birth: valueOrNull(dobInput),
                national_id: valueOrNull(nationalIdInput),
                marital_status_id: maritalStatusSelect.value === '' ? null : maritalStatusSelect.value,
                phone_primary: valueOrNull(phonePrimaryInput),
                phone_secondary: valueOrNull(phoneSecondaryInput),
                country: valueOrNull(countryInput),
                district: valueOrNull(districtInput),
                village: valueOrNull(villageInput),
            };
        }
    };
}
export function createPasswordSetupForm() {
    const container = document.createElement('div');

    const passwordInput = createInput('password', 'Password', 'password', '', {
        required: 'true',
        minlength: '8'
    });

    const confirmPasswordInput = createInput('confirmPassword', 'Confirm Password', 'password', '', {
        required: 'true',
        minlength: '8'
    });

    container.appendChild(createFormGroup('Password', passwordInput));
    container.appendChild(createFormGroup('Confirm Password', confirmPasswordInput));

    return {
        element: container,
        getFormData: () => ({
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value
        })
    };
}

// Helper Functions

function createFormGroup(label, input) {
    const group = document.createElement('div');
    group.style.cssText = 'margin-bottom: 16px;';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = `
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 500;
        color: #333;
    `;

    input.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-family: inherit;
        font-size: 14px;
        box-sizing: border-box;
    `;

    group.appendChild(labelEl);
    group.appendChild(input);

    return group;
}

function createInput(name, placeholder, type = 'text', value = '', attributes = {}) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.value = value;

    Object.entries(attributes).forEach(([key, val]) => {
        input.setAttribute(key, val);
    });

    return input;
}

function createSelect(name, placeholder, options) {
    const select = document.createElement('select');
    select.name = name;

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    options.forEach(option => {
        const optEl = document.createElement('option');
        optEl.value = option.value;
        optEl.textContent = option.label;
        select.appendChild(optEl);
    });

    return select;
}

function formatCurrency(value) {
    const amount = Number(value);
    if (Number.isNaN(amount)) return '0';

    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        maximumFractionDigits: 0,
    }).format(amount);
}
