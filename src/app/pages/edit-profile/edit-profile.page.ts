import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { UserService } from 'src/app/services/user.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule, /*FloatingMenuComponent*/]
})
export class EditProfilePage implements OnInit {

  editProfileForm!: FormGroup;
  userId!: number;
  profileImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private userService: UserService,
    private authUserService: UserAuthService
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec validations
    this.editProfileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9 +()-]{10,20}$')]],
      adresse: ['', Validators.required],
      bio: [''],
      profileImage: ['', Validators.pattern('(https?://.*\\.(?:png|jpg|jpeg|gif|svg|webp))')],
      dateNaissance: ['', Validators.required],
      pays: ['', Validators.required],
    });

    // Récupération des infos depuis le localStorage
    const user = this.authUserService.getUser(); // Doit retourner un objet avec un id
    console.log('user user', user);
    if (user && user.id) {
      this.userId = user.id;

      // Remplissage du formulaire directement depuis les données locales
      this.editProfileForm.patchValue({
        name: user.prenom ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        adresse: user.adresse ?? '',
        bio: user.bio ?? '',
        dob: this.convertToDateInputFormat(user.dateNaissance),
        country: user.pays ?? ''
      });
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  convertToDateInputFormat(timestamp: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      console.log('Formulaire envoyé avec les valeurs :', this.editProfileForm.value);

      const formValue = this.editProfileForm.value;

      const updateData = {
        id: this.userId,
        prenom: formValue.name,
        email: formValue.email,
        bio: formValue.bio,
        adresse: formValue.adresse,
        phone: formValue.phone,
        dateNaissance: new Date(formValue.dob).getTime(), // timestamp
        pays: formValue.country
      };

      console.log("Données à envoyer :", updateData);

      this.userService.updateProfile(updateData).subscribe({
        next: (res) => {
          console.log('Profil mis à jour avec succès', res);
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour du profil", err);
        }
      });
    } else {
      console.warn('Le formulaire est invalide');
    }
  }

  goBack() {
    this.location.back();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.editProfileForm.patchValue({ profileImage: file });
    }
  }
}
