
const gradients = [
    'linear-gradient(180deg, #E6E3E3 60%, #e7e7e7 83%, #E8B77C 100%)',
    'linear-gradient(180deg, #E6E3E3 60%, #e7e7e7 83%, #E9685D 100%)',
    'linear-gradient(180deg, #E6E3E3 60%, #e7e7e7 83%, #C69788 100%)',
    'linear-gradient(180deg, #E6E3E3 60%, #e7e7e7 83%, #612A25 100%)',
    'linear-gradient(180deg, #b1713c75 60%, #b1713c86 83%, #735622 100%)',
    'linear-gradient(180deg, #E6E3E3 60%, #e7e7e7 83%, #B1703C 100%)'
  ];
// Инициализация Supabase
const { createClient } = window.supabase;
const supabaseUrl = "https://yvqgqkmdcdbkpvehqygz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cWdxa21kY2Ria3B2ZWhxeWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzA2OTIsImV4cCI6MjA1OTEwNjY5Mn0.xLI7N1-NOQ-u9q-MJLc-6UVJJ_i59NFS5eVs9lLKb7k";
const supabase = createClient(supabaseUrl, supabaseKey);


let selectedCategory = "Памятники";

document.querySelectorAll(".admin__buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".admin__buttons button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = btn.textContent.trim();
    });
});

async function uploadImage(file) {
    const filePath = `uploads/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
    });

    if (error) {
        console.error("❌ Ошибка загрузки изображения:", error.message);
        alert("Ошибка загрузки изображения!");
        return null;
    }

    const { data: publicData } = supabase.storage.from("images").getPublicUrl(data.path);
    return publicData.publicUrl;
}

async function savePost(title, description, imageUrl, category) {
    const { data, error } = await supabase.from("posts").insert([
        { title, content: description, image_url: imageUrl, category }
    ]);

    if (error) {
        console.error("❌ Ошибка сохранения поста:", error.message);
        alert("Ошибка сохранения поста!");
    } else {
        console.log("✅ Пост успешно сохранен:", data);
        alert("Пост успешно добавлен!");
    }
}


const adminFormButton = document.querySelector(".admin__form button");
if (adminFormButton) {
    adminFormButton.addEventListener("click", async () => {
        const title = document.getElementById("title")?.value.trim();
        const description = document.getElementById("description")?.value.trim();
        const imageFile = document.getElementById("image")?.files[0];

        if (!title || !description || !imageFile) {
            alert("Заполните все поля!");
            return;
        }

        const imageUrl = await uploadImage(imageFile);
        if (imageUrl) {
            await savePost(title, description, imageUrl, selectedCategory);
        }
    });
}
async function loadPosts(category) {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("category", category);

    if (error) {
        console.error("❌ Ошибка загрузки постов:", error.message);
        return;
    }

    console.log("✅ Загруженные посты:", data);
    const postsContainer = document.querySelector("#posts");
    if (!postsContainer) return;

    data.forEach((post, index) => {
        const a = document.createElement("a");
        a.href = "#";
    
        const gradient = gradients[index % gradients.length];
    
        a.innerHTML = `
            <div class="supa__card" style="background: ${gradient}">
                <img src="${post.image_url}" alt="${post.title}">
                <div>${post.title}</div>
            </div>
        `;
        postsContainer.appendChild(a);
    });
    
}
