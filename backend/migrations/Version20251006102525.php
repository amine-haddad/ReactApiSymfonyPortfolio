<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251006102525 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE image ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE image SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL');
        $this->addSql('ALTER TABLE image MODIFY created_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE profile_skill ADD updated_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE profile_skill SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL');
        $this->addSql('ALTER TABLE profile_skill MODIFY updated_at DATETIME NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image DROP created_at');
        $this->addSql('ALTER TABLE profile_skill DROP updated_at');
    }
}
