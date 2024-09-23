async function fetchAvatarsForAll() {
    const liElements = document.querySelectorAll('#popup li');

    for (let li of liElements) {
        const imgElement = li.querySelector('img');

        if (imgElement) {
            const userId = imgElement.alt;

            if (userId) {
                try {
                    const response = await fetch(`https://185.228.81.59:3000/api/avatar/${userId}`);
                    const data = await response.json();

                    if (data.avatarUrl) {
                        // Update the image src with the fetched avatar URL
                        imgElement.src = data.avatarUrl;
                    } else if (data.error) {
                        console.error(`Error for user ${userId}: ${data.error}`);
                    }
                } catch (error) {
                    console.error(`Error fetching avatar for user ${userId}:`, error);
                }
            } else {
                console.error('No Discord User ID found in the alt attribute.');
            }
        }
    }
}

fetchAvatarsForAll();