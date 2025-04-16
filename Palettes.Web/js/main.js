let colorvars = {
    BaseClr: "#1e1e1e",
    SectionClr: "#2a2a2a",
    TextClr: "#ffffff",
    SecondaryTextClr: "#b0b0b0",
    AccentClr: "#4aa3df",
    LineClr: "#474747",
    HoverClr: "#333333",
    ShadowClr: "#d0d0d0",
};

let currentPalette = null;

//Sync Colors
const textInputs = document.querySelectorAll('input[type="text"][color-var]');
textInputs.forEach(textInput => {
    const colorInput = textInput.previousElementSibling;
    const key = textInput.getAttribute("color-var");

    // Color To Text
    colorInput.addEventListener("input", () => {
        textInput.value = colorInput.value;
        updateCSSVar(key, colorInput.value);
    });

    // Text To Color
    textInput.addEventListener("input", () => {
        const value = textInput.value;

        // Only update if valid hex 
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            colorInput.value = value;
            updateCSSVar(key, value);
        }
    });
});

// Update Root CSS
function updateCSSVar(key, value) {
    const cssKey = `-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    document.documentElement.style.setProperty(cssKey, value);
}

// Search Palette
document.getElementById("searchBtn").addEventListener("click", async () => {
    const id = document.getElementById("id").value.trim();
    if (!id) {
        alert("Please enter a palette ID.");
        return;
    }

    try {
        const res = await fetch(`https://palettes-api.onrender.com/api/palettes/${id}`);
        if (!res.ok) {
            alert("Palette not found.");
            return;
        }

        const palette = await res.json();
        currentPalette = palette;

        textInputs.forEach(input => {
            const key = input.getAttribute("color-var");
            const value = palette[key];
            if (value) {
                input.value = value;
                input.previousElementSibling.value = value;
                updateCSSVar(key, value);
            }
        });

        console.log("Palette loaded:", palette);
    } catch (error) {
        alert("Error retrieving palette.");
        console.error(error);
    }
});

// Random Palette
document.getElementById("randomBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("https://palettes-api.onrender.com/api/palettes/random");
        if (!res.ok) {
            alert("No palettes available.");
            return;
        }

        const palette = await res.json();
        currentPalette = palette;
        document.getElementById("id").value = palette.Id;

        textInputs.forEach(input => {
            const key = input.getAttribute("color-var");
            const value = palette[key];

            if (value && /^#[0-9A-Fa-f]{6}$/.test(value)) {
                input.value = value;
                input.previousElementSibling.value = value;
                updateCSSVar(key, value);
            }
        });

        console.log("Random loaded:", palette);
    } catch (error) {
        alert("Failed to load a random palette.");
        console.error(error);
    }
});

//Reset Function
function resetToDefaults() {
    Object.entries(colorvars).forEach(([key, value]) => {
        const textInput = document.querySelector(`input[type="text"][color-var="${key}"]`);
        const colorInput = textInput?.previousElementSibling;

        if (textInput && colorInput) {
            textInput.value = value;
            colorInput.value = value;

            document.documentElement.style.setProperty(
                `-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
                value
            );
        }
        document.getElementById("id").value = "";
    });
}

//Reset Button
document.getElementById("resetBtn").addEventListener("click", (resetToDefaults));

// Copy To Clipboard
document.getElementById("copyBtn").addEventListener("click", () => {
    let cssVars = "";

    textInputs.forEach(textInput => {
        const key = textInput.getAttribute("color-var");
        const value = textInput.value;
        const cssKey = `-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        cssVars += `${cssKey}: ${value};\n`;
    });

    navigator.clipboard.writeText(cssVars)
        .then(() => alert("Copied to clipboard!"))
        .catch(() => alert("Failed to copy."));
});

//Save Palette
document.getElementById("saveBtn").addEventListener("click", async () => {
    if (!currentPalette || !currentPalette.Id) {
        alert("No palette loaded to save.");
        return;
    }

    textInputs.forEach(input => {
        const key = input.getAttribute("color-var");
        currentPalette[key] = input.value;
    });

    try {
        const res = await fetch(`https://palettes-api.onrender.com/api/palettes/${currentPalette.Id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentPalette)
        });

        if (!res.ok) {
            alert("Failed to save palette.");
            return;
        }

        alert("Palette saved successfully!");
        console.log("Saved:", currentPalette);
    } catch (error) {
        alert("Error saving palette.");
        console.error(error);
    }
});

//Add Palette
document.getElementById("addBtn").addEventListener("click", async () => {
    const newPalette = {};

    textInputs.forEach(input => {
        const key = input.getAttribute("color-var");
        newPalette[key] = input.value;
    });

    try {
        const res = await fetch("https://palettes-api.onrender.com/api/palettes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPalette)
        });

        if (!res.ok) {
            alert("Failed to add palette.");
            return;
        }

        const created = await res.json();
        currentPalette = created;
        document.getElementById("id").value = created.Id;

        alert(`Palette added successfully: ID ${created.Id}`);
        console.log("Created:", created);
    } catch (error) {
        alert("Error adding palette.");
        console.error(error);
    }
});

// Delete Palette
document.getElementById("deleteBtn").addEventListener("click", async () => {
    const id = currentPalette?.Id || document.getElementById("id").value.trim();

    if (!id) {
        alert("No palette ID to delete.");
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete palette #${id}?`);
    if (!confirmDelete) return;

    try {
        const res = await fetch(`https://palettes-api.onrender.com/api/palettes/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Failed to delete palette.");
            return;
        }

        // Reset to default
        resetToDefaults();

        currentPalette = null;

        alert(`Palette #${id} deleted.`);
        console.log(`Deleted palette ${id}`);
    } catch (error) {
        alert("Error deleting palette.");
        console.error(error);
    }
});

// Wake server up
window.addEventListener("load", () => {
    fetch("https://palettes-api.onrender.com/api/palettes/ping").catch(() => {});
  });
  