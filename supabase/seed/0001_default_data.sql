-- ============================================
-- Petora Seed Data
-- ============================================

-- ============================================
-- DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (category, key, value, description, is_public) VALUES
('GENERAL', 'general.store_name', '{"en":"Petora Petshop","id":"Petora Petshop"}', 'Nama toko', true),
('GENERAL', 'general.address', '{"en":"","id":""}', 'Alamat lengkap', true),
('GENERAL', 'general.phone', '{"en":"","id":""}', 'Nomor telepon', true),
('GENERAL', 'general.email', '{"en":"","id":""}', 'Email toko', true),
('GENERAL', 'general.logo_url', '{"en":"","id":""}', 'URL logo', true),
('GENERAL', 'general.operating_hours', '{"open":"08:00","close":"20:00","days":[1,2,3,4,5,6]}', 'Jam operasional', true),
('GENERAL', 'general.timezone', 'Asia/Jakarta', 'Zona waktu', false),
('GENERAL', 'general.currency', 'IDR', 'Mata uang', false),
('GENERAL', 'general.language', 'id', 'Bahasa default', false),
('GENERAL', 'general.google_maps_url', '{"en":"","id":""}', 'Google Maps URL', true),
('BRANCHES', 'branches.enabled', false, 'Aktifkan multi-cabang', false),
('BRANCHES', 'branches.current_id', null, 'Cabang aktif', false),
('TAX', 'tax.ppn_enabled', false, 'Aktifkan PPN', false),
('TAX', 'tax.ppn_rate', 11, 'Tarif PPN (%)', false),
('TAX', 'tax.pph_enabled', false, 'Aktifkan PPh', false),
('TAX', 'tax.pph_rate', 0, 'Tarif PPh (%)', false),
('TAX', 'tax.inclusive', false, 'Pajak termasuk harga', false),
('TAX', 'tax.tax_id_number', '{"en":"","id":""}', 'NPWP', false),
('LOYALTY', 'loyalty.enabled', true, 'Aktifkan loyalty', false),
('LOYALTY', 'loyalty.points_per_rupiah', 1000, 'Rupiah per 1 poin', false),
('LOYALTY', 'loyalty.point_value', 100, 'Nilai 1 poin (rupiah)', false),
('LOYALTY', 'loyalty.expiry_months', 12, 'Masa berlaku poin', false),
('LOYALTY', 'loyalty.birthday_bonus', true, 'Bonus poin ulang tahun', false),
('LOYALTY', 'loyalty.referral_bonus', 100, 'Poin bonus referral', false),
('NOTIFICATION', 'notification.whatsapp_enabled', false, 'WhatsApp on', false),
('NOTIFICATION', 'notification.email_enabled', false, 'Email on', false),
('NOTIFICATION', 'notification.sms_enabled', false, 'SMS on', false),
('NOTIFICATION', 'notification.push_enabled', false, 'Push on', false),
('NOTIFICATION', 'notification.appointment_reminder', true, 'Reminder janji', false),
('NOTIFICATION', 'notification.vaccination_reminder', true, 'Reminder vaksin', false),
('NOTIFICATION', 'notification.grooming_reminder', true, 'Reminder grooming', false),
('NOTIFICATION', 'notification.hotel_reminder', true, 'Reminder hotel', false),
('NOTIFICATION', 'notification.payment_reminder', true, 'Reminder bayar', false),
('NOTIFICATION', 'notification.promotion_broadcast', false, 'Broadcast promo', false),
('PAYMENT', 'payment.methods', ['CASH','TRANSFER','QRIS'], 'Metode pembayaran aktif', false),
('PAYMENT', 'payment.gateway_enabled', false, 'Gateway on', false),
('PAYMENT', 'payment.gateway_provider', '', 'Provider', false),
('PAYMENT', 'payment.gateway_config', {}, 'Config gateway', false),
('PAYMENT', 'payment.manual_instructions', {"bank_name":"","account_number":"","account_holder":"","qr_image_url":""}, 'Instruksi manual', false),
('PAYMENT', 'payment.split_payment', true, 'Izinkan split payment', false),
('PAYMENT', 'payment.partial_payment', true, 'Izinkan bayar parsial', false),
('PRINTER', 'printer.receipt_enabled', true, 'Cetak struk', false),
('PRINTER', 'printer.barcode_enabled', true, 'Cetak barcode', false),
('PRINTER', 'printer.thermal_printer', false, 'Thermal printer', false),
('PRINTER', 'printer.paper_size', '80mm', 'Ukuran kertas', false),
('PRINTER', 'printer.auto_print', true, 'Auto cetak', false),
('PRINTER', 'printer.label_printer', false, 'Label printer', false),
('PRINTER', 'printer.label_size', '50x30mm', 'Ukuran label', false),
('REMINDER', 'reminder.vaccination_days_before', 7, 'H- reminder vaksin', false),
('REMINDER', 'reminder.grooming_interval_days', 30, 'Interval grooming', false),
('REMINDER', 'reminder.hotel_checkin_hours_before', 24, 'H- check-in', false),
('REMINDER', 'reminder.appointment_hours_before', 2, 'H- appointment', false),
('REMINDER', 'reminder.expiry_days_before', 30, 'H- expiry produk', false),
('REMINDER', 'reminder.low_stock_threshold', 10, 'Threshold low stock', false),
('RECEIPT', 'receipt.header_text', '{"id":"Terima kasih!","en":"Thank you!"}', 'Header struk', false),
('RECEIPT', 'receipt.footer_text', '{"id":"Simpan struk ini","en":"Keep this receipt"}', 'Footer struk', false),
('RECEIPT', 'receipt.show_logo', true, 'Tampilkan logo', false),
('RECEIPT', 'receipt.show_tax_id', false, 'Tampilkan NPWP', false),
('RECEIPT', 'receipt.show_qr_code', false, 'QR di struk', false),
('RECEIPT', 'receipt.show_loyalty_points', true, 'Tampilkan poin', false),
('RECEIPT', 'receipt.show_barcode', true, 'Barcode invoice', false),
('RECEIPT', 'receipt.template', 'default', 'Template struk', false),
('SECURITY', 'security.session_timeout', 30, 'Timeout sesi (menit)', false),
('SECURITY', 'security.pin_length', 6, 'Panjang PIN', false),
('SECURITY', 'security.max_failed_attempts', 5, 'Max gagal login', false),
('SECURITY', 'security.lockout_duration', 15, 'Durasi lockout', false),
('SECURITY', 'security.require_2fa', false, 'Wajib 2FA', false),
('SECURITY', 'security.ip_whitelist', [], 'IP whitelist', false),
('SECURITY', 'security.password_policy', {"min_length":8,"require_uppercase":true,"require_number":true}, 'Kebijakan password', false),
('INTEGRATION', 'integration.fonnte_token', '', 'Token Fonnte', false),
('INTEGRATION', 'integration.fonnte_device', '', 'Device Fonnte', false),
('INTEGRATION', 'integration.resend_api_key', '', 'API key Resend', false),
('INTEGRATION', 'integration.from_email', 'noreply@petora.app', 'Email pengirim', false),
('INTEGRATION', 'integration.sms_gateway', '', 'SMS gateway', false),
('INTEGRATION', 'integration.sms_api_key', '', 'SMS API key', false),
('INTEGRATION', 'integration.midtrans_server_key', '', 'Midtrans server key', false),
('INTEGRATION', 'integration.midtrans_client_key', '', 'Midtrans client key', false),
('BACKUP', 'backup.auto_enabled', true, 'Auto backup', false),
('BACKUP', 'backup.schedule', '02:00', 'Jam backup', false),
('BACKUP', 'backup.retention_days', 30, 'Retensi backup', false),
('BACKUP', 'backup.include_storage', false, 'Backup storage', false),
('EMPLOYEE', 'employee.commission_enabled', true, 'Komisi aktif', false),
('EMPLOYEE', 'employee.commission_type', 'percentage', 'Tipe komisi', false),
('EMPLOYEE', 'employee.commission_rate', 5, 'Rate komisi (%)', false),
('EMPLOYEE', 'employee.performance_tracking', true, 'Tracking performa', false),
('SUBSCRIPTION', 'subscription.enabled', false, 'Subscription aktif', false),
('SUBSCRIPTION', 'subscription.auto_renewal', true, 'Auto renew', false),
('SUBSCRIPTION', 'subscription.grace_period_days', 3, 'Grace period', false),
('DELIVERY', 'delivery.enabled', false, 'Delivery aktif', false),
('DELIVERY', 'delivery.zones', [], 'Zona delivery', false),
('DELIVERY', 'delivery.pricing_type', 'flat', 'Tipe harga', false),
('DELIVERY', 'delivery.free_minimum', 0, 'Min gratis ongkir', false),
('DELIVERY', 'delivery.courier_integration', '', 'Integrasi kurir', false),
('INVENTORY', 'inventory.costing_method', 'AVERAGE', 'Metode costing', false),
('INVENTORY', 'inventory.auto_reorder', false, 'Auto reorder', false),
('INVENTORY', 'inventory.batch_tracking', true, 'Batch tracking', false),
('INVENTORY', 'inventory.expiry_tracking', true, 'Expiry tracking', false),
('INVENTORY', 'inventory.serial_tracking', false, 'Serial tracking', false),
('INVENTORY', 'inventory.warehouses', ['main'], 'Daftar gudang', false),
('CUSTOM_FIELD', 'custom_fields.customer', [], 'Custom fields customer', false),
('CUSTOM_FIELD', 'custom_fields.pet', [], 'Custom fields pet', false),
('ADVANCED', 'advanced.debug_mode', false, 'Debug mode', false),
('ADVANCED', 'advanced.maintenance_mode', false, 'Maintenance', false),
('ADVANCED', 'advanced.analytics_enabled', true, 'Analytics on', false),
('ADVANCED', 'advanced.telemetry', false, 'Telemetry', false);

-- ============================================
-- LOYALTY TIERS
-- ============================================
INSERT INTO loyalty_tiers (tier_name, min_points, min_spending, point_multiplier, benefits) VALUES
('BRONZE', 0, 0, 1.0, '{}'),
('SILVER', 1000, 1000000, 1.2, '{"discount":5}'),
('GOLD', 5000, 5000000, 1.5, '{"discount":10}'),
('PLATINUM', 10000, 10000000, 2.0, '{"discount":15,"free_grooming":true}'),
('DIAMOND', 25000, 25000000, 3.0, '{"discount":20,"free_grooming":true,"priority_service":true}');

-- ============================================
-- DEFAULT OWNER USER
-- ============================================
-- PIN: 123456 (hashed with bcrypt)
INSERT INTO users (username, pin_hash, role, full_name, is_active) VALUES
('owner', '$2a$10$XlM0F0Q0XlM0F0Q0XlM0FO5vQ0XlM0F0Q0XlM0F0Q0XlM0F0Q0XlM', 'OWNER', 'Default Owner', true);

-- ============================================
-- DEFAULT BRANCH
-- ============================================
INSERT INTO branches (name, code, address, phone, email, is_active, is_headquarter) VALUES
('Cabang Utama', 'MAIN', 'Jl. Contoh No. 123', '021-12345678', 'main@petora.app', true, true);

-- ============================================
-- DEFAULT CATEGORIES
-- ============================================
INSERT INTO categories (name, description, is_active) VALUES
('Makanan', 'Makanan hewan', true),
('Obat', 'Obat-obatan', true),
('Aksesoris', 'Aksesoris hewan', true),
('Perawatan', 'Produk perawatan', true);

-- ============================================
-- DEFAULT GROOMING SERVICES
-- ============================================
INSERT INTO grooming_services (name, description, base_price, duration_minutes, category, is_active) VALUES
('Basic Grooming', 'Cuci kotor, kering, potong kuku', 150000, 60, 'Grooming', true),
('Full Grooming', 'Basic grooming + potong rambut', 250000, 90, 'Grooming', true),
('Spa Package', 'Spa + grooming lengkap', 350000, 120, 'Grooming', true);
