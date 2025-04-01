<?php

namespace App\Controller\Admin;

use App\Entity\Profile;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;

class ProfileCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Profile::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            //IdField::new('id'),
            TextField::new('name', 'Full Name'),
            TextField::new('title', 'Title'),
            TextEditorField::new('bio', 'Description'),
            EmailField::new('email', 'E-m@il'),
            UrlField::new('github_url','Github-Link'),
            UrlField::new('linkedin_url','Linkedin-Link'),

        ];
    }
   
}
