<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250317130138 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, profile_id INT DEFAULT NULL, projects_id INT DEFAULT NULL, skills_id INT DEFAULT NULL, experiences_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_C53D045FCCFA12B8 (profile_id), INDEX IDX_C53D045F1EDE0F55 (projects_id), INDEX IDX_C53D045F7FF61858 (skills_id), INDEX IDX_C53D045F423DE140 (experiences_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile_skill (profile_id INT NOT NULL, skill_id INT NOT NULL, INDEX IDX_A9E97BA5CCFA12B8 (profile_id), INDEX IDX_A9E97BA55585C142 (skill_id), PRIMARY KEY(profile_id, skill_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_skill (project_id INT NOT NULL, skill_id INT NOT NULL, INDEX IDX_4D68EDE9166D1F9C (project_id), INDEX IDX_4D68EDE95585C142 (skill_id), PRIMARY KEY(project_id, skill_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FCCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F1EDE0F55 FOREIGN KEY (projects_id) REFERENCES project (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F7FF61858 FOREIGN KEY (skills_id) REFERENCES skill (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F423DE140 FOREIGN KEY (experiences_id) REFERENCES experience (id)');
        $this->addSql('ALTER TABLE profile_skill ADD CONSTRAINT FK_A9E97BA5CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_skill ADD CONSTRAINT FK_A9E97BA55585C142 FOREIGN KEY (skill_id) REFERENCES skill (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_skill ADD CONSTRAINT FK_4D68EDE9166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_skill ADD CONSTRAINT FK_4D68EDE95585C142 FOREIGN KEY (skill_id) REFERENCES skill (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE experience ADD profile_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE experience ADD CONSTRAINT FK_590C103CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id)');
        $this->addSql('CREATE INDEX IDX_590C103CCFA12B8 ON experience (profile_id)');
        $this->addSql('ALTER TABLE project ADD profile_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EECCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id)');
        $this->addSql('CREATE INDEX IDX_2FB3D0EECCFA12B8 ON project (profile_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045FCCFA12B8');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F1EDE0F55');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F7FF61858');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F423DE140');
        $this->addSql('ALTER TABLE profile_skill DROP FOREIGN KEY FK_A9E97BA5CCFA12B8');
        $this->addSql('ALTER TABLE profile_skill DROP FOREIGN KEY FK_A9E97BA55585C142');
        $this->addSql('ALTER TABLE project_skill DROP FOREIGN KEY FK_4D68EDE9166D1F9C');
        $this->addSql('ALTER TABLE project_skill DROP FOREIGN KEY FK_4D68EDE95585C142');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE profile_skill');
        $this->addSql('DROP TABLE project_skill');
        $this->addSql('ALTER TABLE experience DROP FOREIGN KEY FK_590C103CCFA12B8');
        $this->addSql('DROP INDEX IDX_590C103CCFA12B8 ON experience');
        $this->addSql('ALTER TABLE experience DROP profile_id');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EECCFA12B8');
        $this->addSql('DROP INDEX IDX_2FB3D0EECCFA12B8 ON project');
        $this->addSql('ALTER TABLE project DROP profile_id');
    }
}
