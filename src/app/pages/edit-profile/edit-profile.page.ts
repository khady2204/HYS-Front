import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { UserService } from 'src/app/services/user.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ToastController } from '@ionic/angular';
import { InteretService } from 'src/app/services/interet/interet.service';

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
  interets: any[] = [];
  userInterets: any[] = [];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private userService: UserService,
    private authUserService: UserAuthService,
    private toastController: ToastController,
    private interetService: InteretService
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec validations
    this.editProfileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9 +()-]{9,20}$')]],
      adresse: ['', Validators.required],
      bio: ['', Validators.required],
      dob: ['', Validators.required],
      pays: ['', Validators.required],
      interets: ['', Validators.required],
    });

    // Récupération des infos depuis le localStorage
    const user = this.authUserService.getUser(); // Doit retourner un objet avec un id
    console.log('user user', user);
    if (user && user.id) {
      this.userId = user.id;

      console.log("Numéro récupéré :", user.phone);

      // Remplissage du formulaire directement depuis les données locales
      this.editProfileForm.patchValue({
        prenom: user.prenom ?? '',
        nom: user.nom ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        adresse: user.adresse ?? '',
        bio: user.bio ?? '',
        dob: this.convertToDateInputFormat(user.dateNaissance),
        pays: user.pays ?? ''
      });
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }

    // Charger la liste des interets
    this.loadInterets();
    
    // Charger les interets de l'utilisateur connecté
    this.loadUserInterets();

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
        prenom: formValue.prenom,
        nom: formValue.nom,
        email: formValue.email,
        bio: formValue.bio,
        adresse: formValue.adresse,
        phone: formValue.phone,
        dateNaissance: new Date(formValue.dob).getTime(), // timestamp
        pays: formValue.pays
      };

      this.userService.updateProfile(updateData).subscribe({
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


  goBack() {
    this.location.back();
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
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

  loadInterets() {
    this.interetService.getAllInterets().subscribe({
      next: (data) => {
        this.interets = data;
      },
      error: (err) => {
        console.error('Erreurs lors du chargement des intérets :', err);
      }
    });
  }

  loadUserInterets(): void {
    this.interetService.getCurrentUserInterets().subscribe({
      next: (data) => {
        this.userInterets = data;
        this.editProfileForm.patchValue({
          interets: this.userInterets.map((i: any) => i.id)
        });
      },
      error: (err) => {
        console.error("Erreur lors du chargement des interets de l'utilisateur :", err);
      }
    });
  }

  onCheckboxChange(event: any) {
    const interetsFormArray = this.editProfileForm.get('interets')?.value || [];

    if (event.target.checked) {
      this.editProfileForm.patchValue({
        // Ajoute l'id sélectionné
        interets: [...interetsFormArray, event.target.value]
      });
    } else {
        // Retire l'id déselectionné
        this.editProfileForm.patchValue({
          interets: interetsFormArray.filter((id: any) => id !== event.target.value)
        })
    }
  }
 
}
