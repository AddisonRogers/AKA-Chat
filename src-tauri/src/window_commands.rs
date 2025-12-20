use log::error;
use tauri::{AppHandle, Manager, WebviewWindowBuilder};

#[tauri::command]
pub async fn open_dialog(
    app_handle: AppHandle,
    webview_window: tauri::WebviewWindow,
    dialog_window: String,
) -> Result<(), String> {
    open_dialog_impl(app_handle, webview_window, dialog_window)
        .await
        .map_err(|e| e.to_string())
}

async fn open_dialog_impl(
    handle: AppHandle,
    webview_window: tauri::WebviewWindow,
    dialog_window: String,
) -> Result<(), String> {
    let dialog_label = format!("dialog-{}", dialog_window);
    let title = dialog_window.clone();

    if let Some(existing_window) = handle.get_webview_window(&dialog_label) {
        if let Err(e) = existing_window.set_focus() {
            error!("Error focusing the dialog window: {:?}", e);
        }
    } else {
        let _ = WebviewWindowBuilder::new(&handle, &dialog_label, Default::default())
            .title(title)
            .decorations(true)
            .inner_size(600.0, 400.0)
            .min_inner_size(600.0, 400.0)
            .center()
            .parent(&webview_window).unwrap()
            .build().unwrap();

    }
    Ok(())
}


#[tauri::command]
pub async fn open_settings(
    app_handle: AppHandle,
) -> Result<(), String> {
    let settings_label = "settings";
    let title = "Settings".to_string();

    if let Some(existing_window) = handle.get_webview_window(&settings_label) {
        if let Err(e) = existing_window.set_focus() {
            error!("Error focusing the dialog window: {:?}", e);
        }
    } else {
        let _ = WebviewWindowBuilder::new(&app_handle, &settings_label, Default::default())
            .title(title.clone())
            .decorations(true)
            .inner_size(600.0, 400.0)
            .min_inner_size(600.0, 400.0)
            .center()
            .build().unwrap();

    }
    Ok(())
}