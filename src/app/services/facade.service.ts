import { Injectable, Injector } from "@angular/core";
import { AuthService } from "./auth.service";
import { ColorSchemeService } from "./colorscheme.service";
import { HelperService } from "./helper.service";
import { ImageService } from "./image.service";
import { ListService } from "./list.service";
import { LocalStorageService } from "./localStorage.service";
import { OthersService } from "./others.service";
import { TagService } from "./tag.service";
import { TaskService } from "./task.service";
import { TokenStorageService } from "./token-storage.service";
import { UserService } from "./user.service";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class FacadeService {
  
    private _authService!: AuthService;
    public get authService(): AuthService {
        if(!this._authService) {
            this._authService = this.injector.get(AuthService);
        }
        return this._authService;
    }

    private _ngxSpinnerService!: NgxSpinnerService;
    public get ngxSpinnerService(): NgxSpinnerService {
        if(!this._ngxSpinnerService) {
            this._ngxSpinnerService = this.injector.get(NgxSpinnerService);
        }
        return this._ngxSpinnerService;
    }

    private _colorSchemeService!: ColorSchemeService;
    public get colorSchemeService(): ColorSchemeService {
        if(!this._colorSchemeService) {
            this._colorSchemeService = this.injector.get(ColorSchemeService);
        }
        return this._colorSchemeService;
    }
    
    private _helperService!: HelperService;
    public get helperService(): HelperService {
        if(!this._helperService) {
            this._helperService = this.injector.get(HelperService);
        }
        return this._helperService;
    }

    private _imageService!: ImageService;
    public get imageService(): ImageService {
        if(!this._imageService) {
            this._imageService = this.injector.get(ImageService);
        }
        return this._imageService;
    }

    private _listService!: ListService;
    public get listService(): ListService {
        if(!this._listService) {
            this._listService = this.injector.get(ListService);
        }
        return this._listService;
    }

    private _othersService!: OthersService;
    public get othersService(): OthersService {
        if(!this._othersService) {
            this._othersService = this.injector.get(OthersService);
        }
        return this._othersService;
    }

    private _taskService!: TaskService;
    public get taskService(): TaskService {
        if(!this._taskService) {
            this._taskService = this.injector.get(TaskService);
        }
        return this._taskService;
    }

    private _tagService!: TagService;
    public get tagService(): TagService {
        if(!this._tagService) {
            this._tagService = this.injector.get(TagService);
        }
        return this._tagService;
    }

    private _tokenStorageService!: TokenStorageService;
    public get tokenStorageService(): TokenStorageService {
        if(!this._tokenStorageService) {
            this._tokenStorageService = this.injector.get(TokenStorageService);
        }
        return this._tokenStorageService;
    }

    private _userService!: UserService;
    public get userService(): UserService {
        if(!this._userService) {
            this._userService = this.injector.get(UserService);
        }
        return this._userService;
    }

    private _localStorageService!: LocalStorageService;
    public get localStorageService(): LocalStorageService {
        if(!this._localStorageService) {
            this._localStorageService = this.injector.get(LocalStorageService);
        }
        return this._localStorageService;
    }

    constructor(private injector: Injector) {  }

    /* Auth Service */

    login(username: string, password: string) {
        return this.authService.login(username, password);
    }

    loginWithGoogle() {
        return this.authService.loginWithGoogle();
    }

    register(username: string, email: string, password: string) {
        return this.authService.register(username, email, password);
    }

    changePassword(username: string, password: string) {
        return this.authService.changePassword(username, password);
    }

    changePasswordUsingMail(email: string, password: string) {
        return this.authService.changePasswordUsingMail(email, password);
    }

    resetPassword(email: string) {
        return this.authService.resetPassword(email);
    }

    checkResetPasswordLink(queryParams: any) {
        return this.authService.checkResetPasswordLink(queryParams);
    }

    /* Color Scheme Service */

    loadColorScheme() {
        return this.colorSchemeService.loadColorScheme();
    }

    currentActiveColorScheme() {
        return this.colorSchemeService.currentActiveColorScheme();
    }

    updateColorScheme(scheme: string) {
        return this.colorSchemeService.updateColorScheme(scheme);
    }

    /* Helper Service */

    modalRefConfig(modalRef: any, type:  any, item: any) {
        return this.helperService.modalRefConfig(modalRef, type, item);
    }

    secondsToHoursMinutesSeconds (sec_num: any) {
        return this.helperService.secondsToHoursMinutesSeconds(sec_num);
    }

    getSecondsDiff (date1: any, date2: any) {
        return this.helperService.getSecondsDiff(date1, date2);
    }

    linkifyText (text: string) {
        return this.helperService.linkifyText(text);
    }   

    convertDate(date: any) {
        return this.helperService.convertDate(date);
    }

    /* Image Service */

    setProfilePicture() {
        return this.imageService.setProfilePicture();
    }
    
    /* List Service */

    createList(list: any) {
        return this.listService.createList(list);
    }

    getLists() {
        return this.listService.getLists();
    }

    deleteList(listId: any) {
        return this.listService.deleteList(listId);
    }

    modifyList(listId: any, list: any) {
        return this.listService.modifyList(listId, list);
    }

    /* Others Service */

    getDataForExport() {    
        return this.othersService.getDataForExport();
    }

    importData(data: any) {
        return this.othersService.importData(data);
    }

    checkFile(file: any) {
        return this.othersService.checkFile(file);
    }
    
    getChangelog() {
        return this.othersService.getChangelog();
    }

    /* Tag Service */

    createTag(tag: any) {
        return this.tagService.createTag(tag);
    }

    getTags() {
        return this.tagService.getTags();
    }

    removeTag(tagId: any) {
        return this.tagService.removeTag(tagId);
    }

    removeTags() {
        return this.tagService.removeTags();
    }

    modifyTagColor(tagId: any, color: any) {
        return this.tagService.modifyTagColor(tagId, color);
    }

    /* Task Service */

    createTask(listId: any, task: any) {
        return this.taskService.createTask(listId, task);
    }

    getTasks(listId : any) {
        return this.taskService.getTasks(listId);
    }

    deleteTask(listId: any, taskId: any) { 
        return this.taskService.deleteTask(listId, taskId);
    }

    modifyTask(listId: any, taskId: any, task: any) {
        return this.taskService.modifyTask(listId, taskId, task);
    }

    modifyTasks(listId: string, ids: string) {
        return this.taskService.modifyTasks(listId, ids);
    }

    modifyTaskDates(listId: any, taskId: any, task: Object) {
        return this.taskService.modifyTaskDates(listId, taskId, task);
    }

    cloneTask(data: any) {
        return this.taskService.cloneTask(data);
    }

    /* Token Storage Service */

    signOut() {
        return this.tokenStorageService.signOut();
    }

    saveToken(token: string) {
        return this.tokenStorageService.saveToken(token);
    }
    
    getToken() {
        return this.tokenStorageService.getToken();
    }

    saveUser(user: any) {
        return this.tokenStorageService.saveUser(user);
    }

    getUser() {
        return this.tokenStorageService.getUser();
    }

    /* User Service */

    getPublicContent() {
        return this.userService.getPublicContent();
    }

    getUserBoard() {
        return this.userService.getUserBoard();
    }

    isAdmin() {
        return this.userService.isAdmin();
    }
    
    /* Local Storage Service */
    
    storePageSize(size: number) {
        return this.localStorageService.storePageSize(size);
    }

    getPageSize() {
        return this.localStorageService.getPageSize();
    }

    storeShowTutorial(show: string) {
        return this.localStorageService.storeShowTutorial(show, this.getUser().id);
    }

    getShowTutorial() {
        return this.localStorageService.getShowTutorial(this.getUser().id);
    }

    
    /* Ngx Spinner Service */
    
    showSpinner() {
        return this.ngxSpinnerService.show();
    }

    hideSpinner() {
        return this.ngxSpinnerService.hide();
    }

}