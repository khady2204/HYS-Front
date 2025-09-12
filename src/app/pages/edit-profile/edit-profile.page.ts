import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { UserService } from 'src/app/services/user.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { InteretService } from 'src/app/services/interet/interet.service';

import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, FloatingMenuComponent]
})
export class EditProfilePage implements OnInit {

  editProfileForm!: FormGroup;             // Formulaire de modification
  userId!: number;                         // ID de l'utilisateur
  profileImagePreview: string | ArrayBuffer | null = null; // Aperçu image
  interets: any[] = [];                    // Tous les intérêts disponibles
  userInterets: any[] = [];                // Intérêts de l'utilisateur connecté
  profileImageUrl: any;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private userService: UserService,
    private authUserService: UserAuthService,
    private toastController: ToastController,
    private interetService: InteretService
  ) {}

  ngOnInit(): void {
    // Création du formulaire avec validations
    this.editProfileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9 +()-]{9,20}$')]],
      adresse: ['', Validators.required],
      bio: ['', Validators.required],
      dob: ['', Validators.required],
      interets: ['', Validators.required],
      profileImage:[null]
    });

    // Récupération utilisateur depuis le localStorage
    const user = this.authUserService.getUser();
    console.log('Utilisateur connecté :', user);

    if (user && user.profileImage) {
      this.profileImageUrl = user.profileImage;
    }

    if (user && user.id) {
      this.userId = user.id;

      // Remplissage initial du formulaire
      this.editProfileForm.patchValue({
        prenom: user.prenom ?? '',
        nom: user.nom ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        adresse: user.adresse ?? '',
        bio: user.bio ?? '',
        dob: this.convertToDateInputFormat(user.dateNaissance),
        profileImage: user.profileImage ?? '',
      });
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }

    // Chargement des intérêts
    this.loadInterets();
    this.loadUserInterets();
  }

  /**
   * Convertit un timestamp en string compatible avec un input date (yyyy-MM-dd)
   */
  convertToDateInputFormat(timestamp: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Soumission du formulaire
   */
  onSubmit(): void {
  if (this.editProfileForm.valid) {
    const formValue = this.editProfileForm.value;

    const formData = new FormData();

    formData.append('nom', formValue.nom);
    formData.append('prenom', formValue.prenom);
    formData.append('email', formValue.email);
    formData.append('bio', formValue.bio);
    formData.append('adresse', formValue.adresse);
    formData.append('phone', formValue.phone);
    formData.append('dob', new Date(formValue.dob).getTime().toString());

    // Ajout des intérêts (en tableau)
    formValue.interets.forEach((id: number) => {
      formData.append('interetIds', id.toString());
    });

    // Ajout de la photo si elle existe
    if (formValue.profileImage) {
      formData.append('profileImage', formValue.profileImage);
    }

    this.userService.updateProfile(formData).subscribe({
      next: (res) => {
        this.presentSuccessToast('Profil mis à jour avec succès');
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du profil", err);
      }
    });
  } else {
    console.warn('Le formulaire est invalide');
  }
}


  /**
   * Retour à la page précédente
   */
  goBack() {
    this.location.back();
  }

  /**
   * Affiche un toast de succès
   */
  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  /**
   * Gère la sélection d’une image pour le profil (en base64)
   */
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

  /**
   * Charge tous les intérêts disponibles
   */
  loadInterets() {
    this.interetService.getAllInterets().subscribe({
      next: (data) => {
        this.interets = data;
      },
      error: (err) => {
        console.error('Erreurs lors du chargement des intérêts :', err);
      }
    });
  }

  /**
   * Charge les intérêts de l'utilisateur connecté
   */
  loadUserInterets(): void {
    this.interetService.getCurrentUserInterets().subscribe({
      next: (data) => {
        this.userInterets = data;
        this.editProfileForm.patchValue({
          interets: this.userInterets.map((i: any) => i.id)
        });
      },
      error: (err) => {
        console.error("Erreur lors du chargement des intérêts utilisateur :", err);
      }
    });
  }

  /**
   * Gère l’ajout ou la suppression d’un intérêt dans le formulaire (checkbox)
   */
  onCheckboxChange(event: any) {
    const interetsFormArray = this.editProfileForm.get('interets')?.value || [];

    if (event.target.checked) {
      this.editProfileForm.patchValue({
        interets: [...interetsFormArray, event.target.value]
      });
    } else {
      this.editProfileForm.patchValue({
        interets: interetsFormArray.filter((id: any) => id !== event.target.value)
      });
    }
  }
}
