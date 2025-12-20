use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};
use log::error;

#[tauri::command]
pub async fn open_settings(
    app_handle: AppHandle,
) -> Result<(), String> {
    let settings_label = "settings".to_string();
    let title = "Settings".to_string();

    if let Some(existing_window) = app_handle.get_webview_window(&settings_label) {
        if let Err(e) = existing_window.set_focus() {
            error!("Error focusing the dialog window: {:?}", e);
        }
    } else {
        let _ = WebviewWindowBuilder::new(&app_handle, &settings_label, WebviewUrl::App("settings".parse().unwrap()).into())
            .title(title.clone())
            .decorations(false)
            .inner_size(600.0, 400.0)
            .min_inner_size(600.0, 400.0)
            .center()
            .build().unwrap();

    }
    Ok(())
}