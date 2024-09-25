async function fetchAvatarsForAll() {
    const liElements = document.querySelectorAll('#popup li');
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    for (let li of liElements) {
        const imgElement = li.querySelector('img');

        if (imgElement) {
            const userId = imgElement.alt;

            imgElement.src = "assets/img/black.png";

            if (userId) {
                try {
                    let response = await fetch(`https://api.wxrn.lol/api/avatar/${userId}`);
                    
                    if (!response.ok) {
                        response = await fetch(`${corsProxy}https://185.228.81.59:3000/api/avatar/${userId}`);
                    }

                    const data = await response.json();

                    if (data.avatarUrl) {
                        imgElement.src = data.avatarUrl;
                    } else if (data.error) {
                        console.error(`Error for user ${userId}: ${data.error}`);
                    }
                } catch (error) {
                    console.error(`Failed to fetch avatar for user ${userId}:`, error);
                    continue;
                }
            } else {
                console.error('No Discord User ID found in the alt attribute.');
            }
        }
    }
}

fetchAvatarsForAll();
