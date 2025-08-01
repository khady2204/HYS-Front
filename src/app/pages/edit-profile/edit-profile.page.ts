import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule, FloatingMenuComponent]
})
export class EditProfilePage implements OnInit {

  editProfileForm!: FormGroup; // Déclaration du formulaire
  userId!: number;             // ID de l'utilisateur extrait de l'URL
  profileImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private authUserService: UserAuthService
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec les champs vides et validations
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: [''],
      country: ['']
    });

    // Récupérer l'ID à partir des paramètres de l'URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('userId');
      if (idParam) {
        this.userId = +idParam; // Convertir en nombre
        this.loadUserData(this.userId); // Charger les données
      }
    });
  }

  // Charger les données utilisateur pour pré-remplir le formulaire
  loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user: any) => {
        console.log('Données utilisateur récupérées :', user);

        // Pré-remplir le formulaire avec les données récupérées
        this.editProfileForm.patchValue({
          name: user.prenom,
          email: user.email,
          dob: user.dateNaissance,
          country: user.pays ?? ''
        });
      },
      error: err => {
        console.error('Erreur lors du chargement de l’utilisateur :', err);
      }
    });
  }

  // Méthode de soumission du formulaire
  onSubmit(): void {
    if (this.editProfileForm.valid) {
      console.log('Formulaire envoyé avec les valeurs :', this.editProfileForm.value);
      // Ajoutez ici l'appel API pour enregistrer les modifications
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