function assignBadge(role) {
    const badge = document.createElement("div");
    badge.classList.add("badge", role.toLowerCase());
    badge.textContent = role;
    document.body.appendChild(badge);
}

// Example usage:
assignBadge("Owner");
assignBadge("Admin");
assignBadge("Moderator");
