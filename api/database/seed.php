<?php
/**
 * Dar Zafran — Database Seeder
 *
 * Usage: php api/database/seed.php
 *
 * On first run: creates the super admin account (credentials from .env),
 * default restaurant settings, menu categories, and sample dishes.
 *
 * On subsequent runs: the admin block is skipped automatically if any admin
 * account already exists. Settings, categories, and dishes use INSERT IGNORE
 * and are safe to re-seed without side effects.
 *
 * Required in .env before first run:
 *   ADMIN_EMAIL=you@yourdomain.com
 *   ADMIN_PASSWORD=...              (optional — a random password is generated
 *                                    if absent or shorter than 8 characters)
 */

// Bootstrap
chdir(__DIR__ . '/../..');
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Security.php';

$db = Database::getInstance()->getConnection();

echo "=== Dar Zafran — Database Seeder ===\n\n";

// ─── Admin user ────────────────────────────────────────────────────────────
// Guard: skip entirely if any admin account already exists.
// This prevents unauthorized account creation on subsequent seeder runs.
$existingAdminCount = (int) $db->query(
    "SELECT COUNT(*) FROM users WHERE role IN ('admin','super_admin')"
)->fetchColumn();

$adminCreated = false;
$adminSummary = [];

if ($existingAdminCount > 0) {
    echo "Admin user:    [already exists — skipped]\n\n";
} else {
    // Credentials come from .env — never hardcoded in source control.
    $adminEmail = getenv('ADMIN_EMAIL');
    if (!$adminEmail || !filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
        echo "ERROR: ADMIN_EMAIL is missing or not a valid email address.\n";
        echo "Add ADMIN_EMAIL=you@yourdomain.com to your .env file and re-run.\n";
        exit(1);
    }

    $adminPasswordEnv  = getenv('ADMIN_PASSWORD') ?: '';
    $passwordGenerated = strlen($adminPasswordEnv) < 8;
    $adminPlain        = $passwordGenerated
        ? rtrim(strtr(base64_encode(random_bytes(12)), '+/', '-_'), '=')
        : $adminPasswordEnv;
    unset($adminPasswordEnv); // remove plain env value from scope immediately

    $adminHash = Security::hashPassword($adminPlain);

    $db->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'super_admin')")
       ->execute(['Dar Zafran Admin', $adminEmail, $adminHash]);

    $adminCreated = true;
    $adminSummary = [
        'email'     => $adminEmail,
        'generated' => $passwordGenerated,
        'password'  => $passwordGenerated ? $adminPlain : null, // stored only to print in summary
    ];
    unset($adminPlain); // clear plain text from scope

    echo "Admin user:    {$adminEmail} [created]\n";
    echo "Password:      [see summary at end of output]\n";
    echo "!! Change this password immediately after first login. !!\n\n";
}

// ─── Settings ──────────────────────────────────────────────────────────────
$settings = [
    // General
    ['restaurant_name',             'Dar Zafran',                              'string',  'general'],
    ['tagline',                     'Ancient craft. Present pleasure.',        'string',  'general'],
    ['default_language',            'en',                                      'string',  'general'],
    ['supported_languages',         '["en","fr","ar"]',                        'json',    'general'],
    ['currency',                    'MAD',                                     'string',  'general'],
    ['timezone',                    'Africa/Casablanca',                       'string',  'general'],
    // Contact
    ['phone',                       '+212 524 000 000',                        'string',  'contact'],
    ['email',                       'table@darzafran.ma',                      'string',  'contact'],
    ['address',                     '12 Derb Sidi Bouamar, Medina',            'string',  'contact'],
    ['city',                        'Marrakech',                               'string',  'contact'],
    ['country',                     'Morocco',                                 'string',  'contact'],
    ['whatsapp_number',             '+212524000000',                           'string',  'contact'],
    ['google_maps_url',             '',                                        'string',  'contact'],
    // Social
    ['instagram_url',               '',                                        'string',  'social'],
    ['facebook_url',                '',                                        'string',  'social'],
    // Hours — null means closed
    ['opening_hours',               '{"mon":null,"tue":{"lunch":"12:00-15:00","dinner":"19:00-23:00"},"wed":{"lunch":"12:00-15:00","dinner":"19:00-23:00"},"thu":{"lunch":"12:00-15:00","dinner":"19:00-23:00"},"fri":{"lunch":"12:00-15:00","dinner":"19:00-23:00"},"sat":{"lunch":"12:00-15:00","dinner":"19:00-23:00"},"sun":{"lunch":"12:00-15:00","dinner":"19:00-23:00"}}', 'json', 'hours'],
    // Reservations
    ['reservation_enabled',         '1',                                       'boolean', 'reservation'],
    ['max_guests',                  '12',                                      'integer', 'reservation'],
    ['min_advance_hours',           '2',                                       'integer', 'reservation'],
    ['max_advance_days',            '60',                                      'integer', 'reservation'],
    ['reservation_times_lunch',     '["12:00","12:30","13:00","13:30","14:00","14:30"]',    'json', 'reservation'],
    ['reservation_times_dinner',    '["19:00","19:30","20:00","20:30","21:00","21:30","22:00"]', 'json', 'reservation'],
    // SEO
    ['meta_description_en',         'Dar Zafran — A luxury Moroccan dining experience in the heart of Marrakech Medina. Reserve your table today.', 'string', 'seo'],
];

$stmt = $db->prepare("INSERT IGNORE INTO settings (`key`, `value`, `type`, `group`) VALUES (?, ?, ?, ?)");
foreach ($settings as $s) {
    $stmt->execute($s);
}
echo "Settings:      " . count($settings) . " keys seeded.\n";

// ─── Categories ────────────────────────────────────────────────────────────
$categories = [
    ['Starters',     'Entrées',         'المقبلات',     'starters',  1],
    ['Tagines',      'Tajines',         'الطاجين',      'tagines',   2],
    ['Couscous',     'Couscous',        'الكسكس',       'couscous',  3],
    ['Grills',       'Grillades',       'المشوي',       'grills',    4],
    ['Pastillas',    'Pastillas',       'البسطيلة',     'pastillas', 5],
    ['Desserts',     'Desserts',        'الحلويات',     'desserts',  6],
    ['Beverages',    'Boissons',        'المشروبات',    'beverages', 7],
];

$stmt = $db->prepare("INSERT IGNORE INTO categories (name_en, name_fr, name_ar, slug, sort_order) VALUES (?, ?, ?, ?, ?)");
foreach ($categories as $c) $stmt->execute($c);
echo "Categories:    " . count($categories) . " categories seeded.\n";

// ─── Sample dishes ─────────────────────────────────────────────────────────
// Get category IDs
$catMap = $db->query("SELECT slug, id FROM categories")->fetchAll(PDO::FETCH_KEY_PAIR);

$dishes = [
    // Starters
    [
        'category' => 'starters',
        'name_en'  => 'Zaalouk',
        'name_fr'  => 'Zaalouk',
        'name_ar'  => 'زعلوك',
        'desc_en'  => 'Smoky aubergine and tomato salad seasoned with cumin, paprika and preserved lemon. Served warm with khobz.',
        'desc_fr'  => 'Salade d\'aubergine et de tomate fumée assaisonnée de cumin, paprika et citron confit. Servie chaude avec du khobz.',
        'desc_ar'  => 'سلطة الباذنجان والطماطم المدخنة بالكمون والفلفل الأحمر والليمون المعصفر.',
        'price'    => 65.00, 'featured' => 0, 'tags' => '["vegan","gluten-free"]', 'sort' => 1,
    ],
    [
        'category' => 'starters',
        'name_en'  => 'Moroccan Starters Platter',
        'name_fr'  => 'Plateau de Salades Marocaines',
        'name_ar'  => 'طبق السلطات المغربية',
        'desc_en'  => 'A seasonal selection of six Moroccan salads — carrots with cumin, taktouka, harissa-glazed olives, briouats, and more.',
        'desc_fr'  => 'Une sélection saisonnière de six salades marocaines — carottes au cumin, taktouka, olives au harissa, briouats, et plus.',
        'desc_ar'  => 'تشكيلة موسمية من ست سلطات مغربية — جزر بالكمون وطاكتوكة وزيتون بالهريسة وبريوات.',
        'price'    => 120.00, 'featured' => 1, 'tags' => '["vegetarian"]', 'sort' => 2,
    ],
    // Tagines
    [
        'category' => 'tagines',
        'name_en'  => 'Lamb & Preserved Lemon Tagine',
        'name_fr'  => 'Tajine d\'Agneau au Citron Confit',
        'name_ar'  => 'طاجين الخروف بالليمون المعصفر',
        'desc_en'  => 'Slow-braised lamb shoulder with preserved lemon, green olives, and chermoula — served with warm khobz.',
        'desc_fr'  => 'Épaule d\'agneau mijotée au citron confit, olives vertes et chermoula — servie avec du khobz chaud.',
        'desc_ar'  => 'كتف خروف مطهو ببطء مع الليمون المعصفر والزيتون الأخضر والشيرمولا.',
        'price'    => 220.00, 'featured' => 1, 'tags' => '["gluten-free"]', 'sort' => 1,
    ],
    [
        'category' => 'tagines',
        'name_en'  => 'Kefta & Egg Tagine',
        'name_fr'  => 'Tajine Kefta Mkaouara',
        'name_ar'  => 'طاجين كفتة مقاورة',
        'desc_en'  => 'Tender spiced meatballs in a rich tomato and cumin sauce, finished with cracked eggs and parsley.',
        'desc_fr'  => 'Boulettes de viande épicées dans une sauce tomate et cumin, finies avec des œufs cassés et du persil.',
        'desc_ar'  => 'كرات لحم متبلة بصلصة طماطم الكمون مع البيض المكسور والبقدونس.',
        'price'    => 170.00, 'featured' => 0, 'tags' => '[]', 'sort' => 2,
    ],
    // Couscous
    [
        'category' => 'couscous',
        'name_en'  => 'Royal Couscous',
        'name_fr'  => 'Couscous Royal',
        'name_ar'  => 'كسكس ملكي',
        'desc_en'  => 'Seven-vegetable couscous with lamb, chicken, and merguez sausage. The Friday tradition, every day.',
        'desc_fr'  => 'Couscous aux sept légumes avec agneau, poulet et merguez. La tradition du vendredi, chaque jour.',
        'desc_ar'  => 'كسكس السبع خضار مع الخروف والدجاج والمرقاز.',
        'price'    => 195.00, 'featured' => 1, 'tags' => '[]', 'sort' => 1,
    ],
    // Pastillas
    [
        'category' => 'pastillas',
        'name_en'  => 'Bastilla au Pigeon',
        'name_fr'  => 'Bastilla au Pigeon',
        'name_ar'  => 'بسطيلة الحمام',
        'desc_en'  => 'Crispy warqa pastry filled with spiced pigeon, almonds and eggs dusted with cinnamon and powdered sugar.',
        'desc_fr'  => 'Feuilleté croustillant de warqa farci de pigeon épicé, amandes et œufs, saupoudré de cannelle et sucre glace.',
        'desc_ar'  => 'ورقة مقرمشة محشوة بالحمام المتبل واللوز والبيض مع القرفة والسكر البودرة.',
        'price'    => 185.00, 'featured' => 1, 'tags' => '["signature"]', 'sort' => 1,
    ],
    // Desserts
    [
        'category' => 'desserts',
        'name_en'  => 'Orange Blossom Panna Cotta',
        'name_fr'  => 'Panna Cotta Fleur d\'Oranger',
        'name_ar'  => 'بانا كوتا زهر البرتقال',
        'desc_en'  => 'Silky cream infused with orange blossom water, cardamom, and Moroccan saffron honey.',
        'desc_fr'  => 'Crème soyeuse infusée à l\'eau de fleur d\'oranger, cardamome et miel au safran marocain.',
        'desc_ar'  => 'كريم حريري بماء زهر البرتقال والهيل وعسل الزعفران المغربي.',
        'price'    => 85.00, 'featured' => 1, 'tags' => '["vegetarian","gluten-free"]', 'sort' => 1,
    ],
    [
        'category' => 'desserts',
        'name_en'  => 'Chebakia & Honey',
        'name_fr'  => 'Chebakia au Miel',
        'name_ar'  => 'شباكية بالعسل',
        'desc_en'  => 'Sesame honey cookies fried in argan oil, coated in warm honey and orange blossom water.',
        'desc_fr'  => 'Biscuits au sésame et au miel frits à l\'huile d\'argan, enrobés de miel chaud et d\'eau de fleur d\'oranger.',
        'desc_ar'  => 'حلوى السمسم والعسل المقلية بزيت الأرغان مع عسل دافئ وماء الزهر.',
        'price'    => 65.00, 'featured' => 0, 'tags' => '["vegetarian"]', 'sort' => 2,
    ],
    // Beverages
    [
        'category' => 'beverages',
        'name_en'  => 'Moroccan Mint Tea',
        'name_fr'  => 'Atay Bel Naana',
        'name_ar'  => 'أتاي بالنعناع',
        'desc_en'  => 'Traditional gunpowder green tea with fresh spearmint and cane sugar. Poured theatrically from height.',
        'desc_fr'  => 'Thé vert à la poudre à canon avec menthe fraîche et sucre de canne. Versé de hauteur, façon traditionnelle.',
        'desc_ar'  => 'شاي أخضر تقليدي بالنعناع الطازج وسكر القصب. يُسكب من الارتفاع.',
        'price'    => 35.00, 'featured' => 0, 'tags' => '["vegan","gluten-free"]', 'sort' => 1,
    ],
];

$stmt = $db->prepare("
    INSERT IGNORE INTO dishes
        (category_id, name_en, name_fr, name_ar,
         description_en, description_fr, description_ar,
         price, currency, dietary_tags, is_featured, is_available, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'MAD', ?, ?, 1, ?)
");

foreach ($dishes as $d) {
    $catId = $catMap[$d['category']] ?? null;
    if (!$catId) {
        echo "  WARNING: Category '{$d['category']}' not found, skipping '{$d['name_en']}'\n";
        continue;
    }
    $stmt->execute([
        $catId, $d['name_en'], $d['name_fr'], $d['name_ar'],
        $d['desc_en'], $d['desc_fr'], $d['desc_ar'],
        $d['price'], $d['tags'], $d['featured'], $d['sort'],
    ]);
}
echo "Dishes:        " . count($dishes) . " sample dishes seeded.\n";

echo "\n✓ Database seeded successfully.\n\n";
echo "─────────────────────────────────────────\n";
if ($adminCreated) {
    echo " First-run admin credentials:\n";
    echo "   Email:    {$adminSummary['email']}\n";
    if ($adminSummary['generated']) {
        echo "   Password: {$adminSummary['password']}\n";
        echo "\n   ↑ GENERATED — save it now, it will\n";
        echo "     not be displayed again.\n";
    } else {
        echo "   Password: [the value you set in ADMIN_PASSWORD]\n";
    }
    echo "\n IMPORTANT: Change the admin password\n";
    echo " immediately after your first login!\n";
} else {
    echo " Admin:   [pre-existing account — not modified]\n";
    echo "\n Settings, categories and dishes were\n";
    echo " updated normally (INSERT IGNORE).\n";
}
echo "─────────────────────────────────────────\n";
