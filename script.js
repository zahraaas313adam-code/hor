// Data Store
let storeData = JSON.parse(localStorage.getItem('hor_store')) || null;
let allOrders = JSON.parse(localStorage.getItem('hor_orders')) || [];
let cart = [];

function switchPage(pageId) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);

    if(pageId === 'storePage') renderStorePageContent();
    if(pageId === 'adminPage') renderAdminContent();
    if(pageId === 'cartPage') renderCartPageContent();
}

function renderStorePageContent() {
    let box = document.getElementById('storePageContent');
    if(!storeData) {
        box.innerHTML = `
            <h3 style="margin-bottom: 15px; color: var(--primary);">تسجيل متجر جديد على هور</h3>
            <div class="form-group"><label class="form-label">اسم المتجر:</label><input type="text" id="regName" class="form-control" placeholder="مثال: متجر عشتار"></div>
            <div class="form-group"><label class="form-label">رابط اللوكو (شعار المتجر):</label><input type="text" id="regLogo" class="form-control" placeholder="رابط الصورة أو رمز 🎨"></div>
            <div class="form-group"><label class="form-label">رقم الهاتف:</label><input type="text" id="regPhone" class="form-control" placeholder="07xxxxxxxxx"></div>
            <div class="form-group"><label class="form-label">البريد الإلكتروني:</label><input type="email" id="regEmail" class="form-control" placeholder="name@email.com"></div>
            <button class="btn-main" onclick="registerStore()">تسجيل المتجر الآن</button>
        `;
    } else {
        let prodHtml = '';
        if(storeData.products.length === 0) {
            prodHtml = '<p style="color:#94a3b8; font-size:0.85rem; margin-top:8px;">لم تضف أي منتج بعد.</p>';
        } else {
            storeData.products.forEach((p, idx) => {
                let shareText = `منتج ${p.name} بسعر ${p.price} د.ع متوفر في منصة هور للتجارة الإلكترونية!`;
                prodHtml += `
                    <div class="product-card">
                        <div>
                            <strong>${p.name}</strong> - <span style="color:var(--secondary);">${p.price} د.ع</span>
                            <div style="font-size:0.75rem; color:#64748b;">${p.desc}</div>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button onclick="shareProductItem('${p.name}', '${p.price}')" style="background:#0284c7; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.75rem;">مشاركة</button>
                            <button onclick="deleteProduct(${idx})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.75rem;">حذف</button>
                        </div>
                    </div>
                `;
            });
        }

        let storeLink = `https://zahraaas313adam-code.github.io/hor/?store=${encodeURIComponent(storeData.name)}`;

        box.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:10px;">
                <div style="font-size:2rem;">${storeData.logo.startsWith('http') ? '<img src="'+storeData.logo+'" width="40" height="40" style="border-radius:50%"/>' : storeData.logo}</div>
                <div>
                    <h3 style="color:var(--primary);">${storeData.name}</h3>
                    <span style="font-size:0.75rem; color:#64748b;">البريد: ${storeData.email} | الهاتف: ${storeData.phone}</span>
                </div>
            </div>
            
            <!-- لوحة إحصائيات التاجر (العدادات) -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:12px;">
                <div style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid var(--border); text-align:center;">
                    <div style="font-size:0.75rem; color:#64748b;">عدد منتجاتك</div>
                    <div style="font-size:1.2rem; font-weight:bold; color:var(--primary);">${storeData.products.length}</div>
                </div>
                <div style="background:#f8fafc; padding:10px; border-radius:8px; border:1px solid var(--border); text-align:center;">
                    <div style="font-size:0.75rem; color:#64748b;">طلبات الزبائن</div>
                    <div style="font-size:1.2rem; font-weight:bold; color:var(--secondary);">${allOrders.length}</div>
                </div>
            </div>

            <div style="margin-bottom:12px;">
                <span style="font-size:0.85rem; font-weight:bold; color:#334155;">رابط متجرك الخاص:</span>
                <div style="display:flex; gap:5px; margin-top:3px;">
                    <input type="text" id="storeLinkInput" class="form-control" readonly value="${storeLink}" style="font-size:0.75rem; background:#f1f5f9;">
                    <button class="btn-main" style="width:auto; padding:0 12px; font-size:0.8rem;" onclick="copyStoreLink()">نسخ</button>
                </div>
            </div>
            <button class="btn-main" style="background:var(--secondary); margin-bottom:15px;" onclick="switchPage('addProductPage')">+ أضف منتج جديد</button>
            <h4 style="font-size:0.9rem; color:#334155; margin-bottom:5px;">منتجات متجرك:</h4>
            ${prodHtml}
        `;
    }
}

function registerStore() {
    let name = document.getElementById('regName').value;
    let logo = document.getElementById('regLogo').value || '🏪';
    let phone = document.getElementById('regPhone').value;
    let email = document.getElementById('regEmail').value;

    if(!name || !phone) { alert("يرجى إكمال الحقول الأساسية!"); return; }

    storeData = { name, logo, phone, email, products: [] };
    localStorage.setItem('hor_store', JSON.stringify(storeData));
    renderStorePageContent();
    alert("مبروك! تم إنشاء متجرك بنجاح 🎉");
}

function copyStoreLink() {
    let input = document.getElementById('storeLinkInput');
    navigator.clipboard.writeText(input.value);
    alert("تم نسخ رابط متجرك بنجاح! شاركه الآن مع أصدقائك 📋✨");
}

function shareProductItem(name, price) {
    let text = `تسوق الآن منتج "${name}" بسعر ${price} د.ع من منصة هور للتجارة الإلكترونية!`;
    if (navigator.share) {
        navigator.share({ title: name, text: text, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text);
        alert("تم نسخ تفاصيل المنتج لمشاركتها!");
    }
}

function saveProduct() {
    let name = document.getElementById('pName').value;
    let price = document.getElementById('pPrice').value;
    let desc = document.getElementById('pDesc').value;
    let image = document.getElementById('pImage').value;

    if(!name || !price) { alert("أدخل اسم المنتج والسعر!"); return; }

    storeData.products.push({ name, price, desc, image });
    localStorage.setItem('hor_store', JSON.stringify(storeData));
    switchPage('storePage');
    alert("تم إضافة المنتج ونشره بمتجرك بنجاح ✨");
}

function deleteProduct(idx) {
    storeData.products.splice(idx, 1);
    localStorage.setItem('hor_store', JSON.stringify(storeData));
    renderStorePageContent();
}

function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cartCount').innerText = cart.length;
    document.getElementById('cartFloatBtn').style.display = 'flex';
    alert("تمت إضافة المنتج إلى السلة بنجاح! 🛒");
}

function renderCartPageContent() {
    let list = document.getElementById('cartItemsList');
    if(cart.length === 0) {
        list.innerHTML = '<p style="color:#94a3b8; text-align:center;">السلة فارغة.</p>';
    } else {
        let html = '';
        cart.forEach((item) => {
            html += `<div style="display:flex; justify-content:space-between; padding:6px 0; font-size:0.85rem;"><span>${item.name}</span><span style="color:var(--secondary);">${item.price} د.ع</span></div>`;
        });
        list.innerHTML = html;
    }
}

function checkoutOrder() {
    let name = document.getElementById('cName').value;
    let phone = document.getElementById('cPhone').value;
    let address = document.getElementById('cAddress').value;
    let payment = document.getElementById('cPayment').value;

    if(!name || !phone || !address || cart.length === 0) {
        alert("يرجى ملء جميع معلومات التوصيل والتأكد من وجود منتجات بالسلة!");
        return;
    }

    let order = { name, phone, address, payment, items: cart, date: new Date().toLocaleString() };
    allOrders.push(order);
    localStorage.setItem('hor_orders', JSON.stringify(allOrders));

    cart = [];
    document.getElementById('cartCount').innerText = '0';
    document.getElementById('cartFloatBtn').style.display = 'none';
    alert("تم إرسال طلبك بنجاح! شكراً لتسوقك من منصة هور 🎉");
    switchPage('homePage');
}

function renderAdminContent() {
    let box = document.getElementById('adminPanelContent');
    let storeInfo = storeData ? `<p><b>اسم المتجر المسجل:</b> ${storeData.name} (عدد المنتجات: ${storeData.products.length})</p><p><b>البريد والهاتف:</b> ${storeData.email} - ${storeData.phone}</p>` : `<p style="color:#94a3b8;">لا توجد متاجر مسجلة حالياً.</p>`;
    
    let ordersHtml = '';
    if(allOrders.length === 0) {
        ordersHtml = '<p style="color:#94a3b8; font-size:0.8rem;">لا توجد طلبات شراء مسجلة حتى الآن.</p>';
    } else {
        allOrders.forEach(o => {
            ordersHtml += `<div style="background:#fff; padding:10px; border-radius:6px; margin-bottom:8px; border:1px solid var(--border);"><b>الزبون:</b> ${o.name} (${o.phone})<br><b>العنوان:</b> ${o.address}<br><b>طريقة الدفع:</b> ${o.payment}<br><b>الوقت:</b> ${o.date}</div>`;
        });
    }

    box.innerHTML = `
        <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:12px; border:1px solid var(--border);">
            <h4 style="color:var(--primary); margin-bottom:5px;">📊 تفاصيل المتاجر المسجلة:</h4>
            ${storeInfo}
        </div>
        <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:12px; border:1px solid var(--border);">
            <h4 style="color:var(--primary); margin-bottom:5px;">🛒 طلبات الزبائن ومعلوماتهم:</h4>
            ${ordersHtml}
        </div>
    `;
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetStore = urlParams.get('store');
    if(targetStore && storeData && storeData.name === targetStore) {
        let container = document.getElementById('homeMainContainer');
        let prodsHtml = '';
        storeData.products.forEach((p) => {
            prodsHtml += `
                <div class="product-card">
                    <div>
                        <b>${p.name}</b> - <span style="color:var(--secondary);">${p.price} د.ع</span>
                        <div style="font-size:0.75rem; color:#64748b;">${p.desc}</div>
                    </div>
                    <button class="btn-main" style="width:auto; padding:6px 12px; font-size:0.8rem;" onclick="addToCart('${p.name}', '${p.price}')">شراء</button>
                </div>
            `;
        });
        container.innerHTML = `
            <div class="panel">
                <h2>🏪 متجر: ${storeData.name}</h2>
                <p style="font-size:0.85rem; color:#64748b; margin-top:3px;">للتواصل مع التاجر: ${storeData.phone}</p>
                <hr style="margin:15px 0; border:0; border-top:1px solid var(--border);">
                <h4>منتجات المتجر المعروضة:</h4>
                ${prodsHtml || '<p style="color:#94a3b8; font-size:0.85rem; margin-top:10px;">هذا المتجر لم يضف منتجات بعد.</p>'}
            </div>
        `;
    }
}
