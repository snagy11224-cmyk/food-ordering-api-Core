import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {


  await knex.raw(`
    INSERT INTO roles (name, display_name, description, created_at, updated_at)
    VALUES
      ('owner', 'Restaurant Owner', 'Full access to all restaurant resources', NOW(), NOW()),
      ('branch_manager', 'Branch Manager', 'Manages branch operations and staff', NOW(), NOW()),
      ('staff', 'Staff Member', 'Limited access for daily operations', NOW(), NOW())
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO permissions (resource, action, created_at)
    VALUES
      ('core:product', 'create', NOW()),
      ('core:product', 'read', NOW()),
      ('core:product', 'update', NOW()),
      ('core:member', 'create', NOW()),
      ('core:member', 'read', NOW()),
      ('core:member', 'update', NOW()),
      ('core:branch', 'read', NOW()),
      ('core:branch', 'update', NOW())
    ON CONFLICT (resource, action) DO NOTHING;

    INSERT INTO role_permissions (role_id, permission_id, created_at)
    SELECT r.id, p.id, NOW()
    FROM roles r
    CROSS JOIN permissions p
    WHERE r.name = 'owner'
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    INSERT INTO role_permissions (role_id, permission_id, created_at)
    SELECT r.id, p.id, NOW()
    FROM roles r
    JOIN permissions p
      ON (p.resource, p.action) IN (
        ('core:product', 'read'),
        ('core:product', 'update'),
        ('core:member', 'read'),
        ('core:branch', 'read'),
        ('core:branch', 'update')
      )
    WHERE r.name = 'branch_manager'
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    INSERT INTO role_permissions (role_id, permission_id, created_at)
    SELECT r.id, p.id, NOW()
    FROM roles r
    JOIN permissions p
      ON (p.resource, p.action) IN (
        ('core:product', 'read'),
        ('core:member', 'read'),
        ('core:branch', 'read')
      )
    WHERE r.name = 'staff'
    ON CONFLICT (role_id, permission_id) DO NOTHING;
  `);
}

export async function down(knex: Knex): Promise<void> {
await knex.raw(`
    DELETE FROM role_permissions
    WHERE role_id IN (
      SELECT id FROM roles
      WHERE name IN ('owner', 'branch_manager', 'staff')
    );

    DELETE FROM permissions
    WHERE (resource, action) IN (
      ('core:product', 'create'),
      ('core:product', 'read'),
      ('core:product', 'update'),
      ('core:member', 'create'),
      ('core:member', 'read'),
      ('core:member', 'update'),
      ('core:branch', 'read'),
      ('core:branch', 'update')
    );

    DELETE FROM roles
    WHERE name IN ('owner', 'branch_manager', 'staff');
  `);
}

