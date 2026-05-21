import { fetchProfile } from '../api.js';
import { initialsFromName, formatCurrency } from '../helpers.js';

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value !== undefined && value !== null ? value : element.textContent;
    }
}

function renderProfile(data = {}) {
    const name = data.name || 'Member Name';
    const memberId = data.memberId || 'Member #00000';
    const joinedOn = data.joinedOn || 'Date unavailable'; 
    const email = data.email || 'email@example.com';
    const phone = data.phone || 'N/A';
    const nationalId = data.nationalId || 'N/A';
    const gender = data.gender || 'N/A';
    const membershipClass = data.membershipClass || 'Ordinary member';
    const shares = formatCurrency(data.sharesValue || 0);
    const totalSavings = formatCurrency(data.totalSavings || 0);
    const guarantors = data.guarantors || '0 active';

    setText('avatar-initials', initialsFromName(name));
    setText('member-name', name);
    setText('member-role', `${memberId}`);
    setText('profile-avatar', initialsFromName(name));
    setText('profile-name', name);
    setText('profile-id-line', `${memberId} · ${joinedOn}`);

    const personalInfo = document.getElementById('profile-personal-info');
    if (personalInfo) {
        personalInfo.innerHTML = `
        <div>
            <div class="field-label">Full name</div>
            <div class="field-value">${name}</div>
        </div>
        <div>
            <div class="field-label">National ID</div>
            <div class="field-value">${nationalId}</div>
        </div>
        <div>
            <div class="field-label">Gender</div> 
            <div class="field-value">${gender}</div>
        </div>
        <div>
            <div class="field-label">Phone</div>
            <div class="field-value">${phone}</div>
        </div>
        <div>
            <div class="field-label">Email</div>
            <div class="field-value">${email}</div>
        </div>`;
    }

    const membershipInfo = document.getElementById('profile-membership-info');
    if (membershipInfo) {
        membershipInfo.innerHTML = `
        <div>
            <div class="field-label">Membership class</div>
            <div class="field-value">${membershipClass}</div>
        </div>
        <div>
            <div class="field-label">Shares held</div>
            <div class="field-value">${shares}</div>
        </div>
        <div>
            <div class="field-label">Total savings</div>
            <div class="field-value">${totalSavings}</div>
        </div>
        <div>
            <div class="field-label">Active guarantors</div>
            <div class="field-value">${guarantors}</div>
        </div>`;
    }
}

export async function loadProfile() {
    try {
        // FIXED: fetchProfile internally triggers transformMemberToProfile
        // Do not double transform the result here!
        const cleanProfileData = await fetchProfile(); 
        renderProfile(cleanProfileData);
    } catch (error) {
        console.error("Failed to load SACCO profile info into the view UI:", error);
    }
}