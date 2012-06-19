<?php

$settings = JquerySpeechPluginFactory::load();

if( count($_POST) > 0 ) {
    $settings->setNotSupportedMessage($_POST['support_message']);
    $settings->setDebugMode($_POST['debug_mode']);
    $settings->setIsActive(isset($_POST['is_active']));
    JquerySpeechPluginFactory::save( $settings );
    $message = __('Settings updated');
}

?><div id="jqspeech-options" class="wrap">

	<div id="icon-options-general" class="icon32"><br /></div>
	<h2><?php _e('jQuery Speech Interface'); ?></h2>
	
	<?php if( isset($message) ): ?>
		<div id="setting-error-settings_updated" class="updated settings-error"> 
			<p><strong><?php echo $message; ?></strong></p>
		</div>
	<?php endif; ?>
	
	<h3><?php _e('Settings') ?></h3>

	<form action="" method="post">

		<table class="form-table">
			<tbody>
				<tr>
					<th scope="row">
						<label for="support_message">
                            <?php _e('Message that will be display when browser doesn\'t support -webkit-speech') ?>
						</label>
					</th>
					<td>
						<input type="text" id="support_message" name="support_message" value="<?php echo htmlspecialchars($settings->getNotSupportedMessage()); ?>" />
                        <br />
                        <span class="info">
                            <?php _e('Leave this field empty if you don\'t want a message to be displayed') ?>
                        </span>
					</td>
				</tr>
                <tr>
					<th scope="row">
						<label for="support_message">
                            <?php _e('Debug Mode') ?>
						</label>
					</th>
					<td>
                        <select name="debug_mode">
                            <option value="0"<?=$settings->getDebugMode() == 0 ? ' selected="selected"':''?>><?php _e('No debug messages') ?></option>
                            <option value="1"<?=$settings->getDebugMode() == 1 ? ' selected="selected"':''?>><?php _e('Show status messages') ?></option>
                            <option value="2"<?=$settings->getDebugMode() == 2 ? ' selected="selected"':''?>><?php _e('Display all messages') ?></option>
                        </select>
					</td>
				</tr>
				<tr>
                    <th scope="row">
                        <label for="is_active">
                            <?php _e('Speech interface active') ?>
                        </label>
                    </th>
					<td>
						<input type="checkbox" id="is_active" name="is_active" value="1"<?php echo $settings->isActive() ? ' checked="checeked"':''?> />
                        <span class="info">
                            <?php _e('Uncheck this option if you want to disable the speech interface') ?>
                        </span>
					</td>
				</tr>
			</tbody>
		</table>
		<p class="submit">
		    <input type="submit" value="<?php _e('Save Changes') ?>" class="button-primary" id="submit" name="submit">
        </p>
    </form>
</div>