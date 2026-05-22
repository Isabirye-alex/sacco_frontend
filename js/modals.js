// Modal and Popup System

export function showModal(title, content, actions = [], options = { fullScreen: false }) {
    // Pass options into element creator so layout can adapt natively
    const modal = createModalElement(title, content, actions, options);
    document.body.appendChild(modal);
    
    modal.style.display = 'flex';

    return {
        close: () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        }
    };
}

export function showSuccessMessage(message, duration = 3000) {
    const popup = createPopupElement(message, 'success');
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => popup.remove(), 300);
    }, duration);
}

export function showErrorMessage(message, duration = 4000) {
    const popup = createPopupElement(message, 'error');
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => popup.remove(), 300);
    }, duration);
}

function createModalElement(title, content, actions, options = { fullScreen: false }) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000; /* Bumped slightly above popups if needed */
        animation: fadeIn 0.3s ease-out;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Natively handle layout geometry variations here
    if (options.fullScreen) {
        modalContent.style.cssText = `
            background: white;
            border-radius: 0px;
            padding: 24px;
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            box-shadow: none;
            position: relative;
        `;
    } else {
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            position: relative;
        `;
    }

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 20px;
        font-weight: 600;
        color: #1a2e1a;
    `;

    const contentEl = document.createElement('div');
    contentEl.className = 'modal-body-wrapper';
    
    if (options.fullScreen) {
        // Full screen needs flex distribution to handle long scrolling forms comfortably
        contentEl.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin: 10px 0;
            color: #333;
            padding-right: 4px; /* prevents scrolling scrollbar overlapping fields */
        `;
    } else {
        contentEl.style.cssText = `
            margin: 20px 0;
            color: #333;
        `;
    }

    if (typeof content === 'string') {
        contentEl.innerHTML = content;
    } else {
        // Apply responsive full sizing to standard wrapper nodes passed through variables
        if (options.fullScreen && content instanceof HTMLElement) {
            content.style.width = '100%';
            content.style.height = 'auto';
        }
        contentEl.appendChild(content);
    }

    const footer = document.createElement('div');
    footer.style.cssText = `
        display: flex;
        gap: 12px;
        margin-top: auto; /* Pushes the buttons perfectly to the bottom frame in fullscreen */
        padding-top: 16px;
        justify-content: flex-end;
    `;

    actions.forEach(action => {
        const button = document.createElement('button');
        button.textContent = action.label;
        button.onclick = action.onClick;
        button.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            background: ${action.primary ? '#3b6d11' : '#e0e0e0'};
            color: ${action.primary ? 'white' : '#333'};
            transition: background 0.2s;
        `;
        button.onmouseover = () => {
            button.style.background = action.primary ? '#2d5209' : '#d0d0d0';
        };
        button.onmouseout = () => {
            button.style.background = action.primary ? '#3b6d11' : '#e0e0e0';
        };
        footer.appendChild(button);
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #999;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
    `;
    closeBtn.onclick = () => modal.remove();

    modalContent.appendChild(titleEl);
    modalContent.appendChild(contentEl);
    modalContent.appendChild(footer);
    modalContent.appendChild(closeBtn);

    modal.appendChild(modalContent);

    // Close on overlay click (Only if not a critical full screen view)
    modal.onclick = (e) => {
        if (!options.fullScreen && e.target === modal) modal.remove();
    };

    return modal;
}

function createPopupElement(message, type) {
    const popup = document.createElement('div');
    popup.className = `popup popup-${type}`;

    const bgColor = type === 'success' ? '#eaf3de' : '#fcebeb';
    const borderColor = type === 'success' ? '#3b6d11' : '#a32d2d';
    const textColor = type === 'success' ? '#3b6d11' : '#a32d2d';
    const icon = type === 'success' ? '✓' : '✕';

    popup.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 8px;
        padding: 16px 20px;
        color: ${textColor};
        font-weight: 500;
        z-index: 20000; /* Sits over full screen overlays seamlessly */
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;

    const iconEl = document.createElement('span');
    iconEl.textContent = icon;
    iconEl.style.cssText = `
        font-size: 20px;
        font-weight: bold;
        min-width: 24px;
    `;

    const messageEl = document.createElement('span');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        flex: 1;
    `;

    popup.appendChild(iconEl);
    popup.appendChild(messageEl);

    return popup;
}

// Add animations to style tag
if (!document.querySelector('style[data-modals]')) {
    const style = document.createElement('style');
    style.setAttribute('data-modals', 'true');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}